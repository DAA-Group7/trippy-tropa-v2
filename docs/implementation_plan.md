# Trippy Tropa v2 — Smart Classroom Grouping Platform

A full-stack academic tool that enables teachers and student officers to manage classrooms, auto-balance student groups using skill-based algorithms, and assign tasks optimally using the Hungarian algorithm.

## Design Decisions Summary

| Decision | Choice |
|---|---|
| **Tech Stack** | Next.js 15 (App Router) + Supabase (PostgreSQL, Auth, Storage) |
| **Auth** | Email/password only |
| **Roles** | Student vs Teacher at sign-up; Student Officer is per-classroom promotion |
| **Skill Assessment** | Custom skills per classroom, 1-5 self-rating, teacher-set multipliers |
| **Grouping** | Teacher specifies number of groups; Greedy LPT algorithm |
| **Leader** | Auto-assigned: highest overall skill score in each group |
| **Tasks** | Any member can add; only leader can delete |
| **Time Matrix** | Estimated hours per cell; Hungarian algorithm for 1:1 optimal assignment |
| **Submissions** | Text/link + file upload (Supabase Storage, 50MB max); re-submittable; leader submits for group |
| **Deadlines** | Due dates with late marking |
| **QR Codes** | Client-side via `qrcode.react` |
| **Invite Code** | 6-char alphanumeric |
| **Permanent Groups** | Created once, reused across all group activities for the semester |
| **UI** | Dark mode, glassmorphism, sidebar nav, Discord/Linear-inspired |
| **Task UI** | Kanban board (To Do / In Progress / Done) with drag-and-drop |
| **Notifications** | In-app bell icon, database-stored (no push/email for MVP) |
| **Permission Transfer** | Explicit "Transfer Ownership" button with accept flow |
| **Deployment** | Vercel + Supabase Cloud (free tiers) |
| **Security** | Supabase Row Level Security (RLS) |

---

## MVP Feature Scope

### Must-Have (Phase 1)
- ✅ Auth (sign-up/login with role selection)
- ✅ Dashboard (teacher & student views)
- ✅ Classroom CRUD + QR code / invite link / 6-char code
- ✅ Skill assessment configuration & onboarding
- ✅ Activity CRUD (individual & group types)
- ✅ Greedy LPT auto-balanced grouping with preview/manual edit
- ✅ Hungarian algorithm task assignment with time estimation matrix
- ✅ Kanban task management board
- ✅ Ownership transfer (Student Officer → Teacher)
- ✅ Submissions (text/link + file upload)

### Phase 2 (Fast Follow-Up)
- In-app notifications (bell icon)
- File upload submissions with preview
- Permanent groups for the semester
- Due date countdown & late submission marking

---

## Proposed Changes

### 1. Project Initialization

#### [NEW] Project Setup
- Initialize Next.js 15 with App Router, TypeScript, ESLint
- Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `qrcode.react`, `@dnd-kit/core` (drag-and-drop for Kanban), `munhkres` or custom Hungarian implementation
- Configure Supabase client (server + client components)
- Set up environment variables (`.env.local`)

---

### 2. Database Schema (Supabase/PostgreSQL)

#### [NEW] Supabase Migrations

**`profiles` table** — extends Supabase auth.users
```sql
- id (UUID, FK → auth.users)
- full_name (TEXT)
- role ('student' | 'teacher')
- avatar_url (TEXT, nullable)
- created_at (TIMESTAMPTZ)
```

**`classrooms` table**
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- invite_code (VARCHAR(6), UNIQUE) -- e.g., "XK7M2P"
- owner_id (UUID, FK → profiles) -- teacher or student officer who owns it
- created_by_role ('teacher' | 'student') -- tracks who originally created it
- has_permanent_groups (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMPTZ)
```

**`classroom_members` table**
```sql
- id (UUID, PK)
- classroom_id (UUID, FK → classrooms)
- user_id (UUID, FK → profiles)
- role ('student' | 'student_officer' | 'teacher') -- per-classroom role
- joined_at (TIMESTAMPTZ)
- has_completed_onboarding (BOOLEAN, DEFAULT false)
- UNIQUE(classroom_id, user_id)
```

**`skills` table** — teacher-defined skills per classroom
```sql
- id (UUID, PK)
- classroom_id (UUID, FK → classrooms)
- name (TEXT) -- e.g., "Python", "UI Design"
- multiplier (DECIMAL, DEFAULT 1.0)
- order_index (INTEGER)
```

**`student_skills` table** — student self-ratings
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- skill_id (UUID, FK → skills)
- rating (INTEGER, 1-5)
- UNIQUE(user_id, skill_id)
```

**`activities` table**
```sql
- id (UUID, PK)
- classroom_id (UUID, FK → classrooms)
- title (TEXT)
- description (TEXT)
- type ('individual' | 'group')
- due_date (TIMESTAMPTZ, nullable)
- num_groups (INTEGER, nullable) -- only for group activities
- groups_created (BOOLEAN, DEFAULT false)
- tasks_assigned (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMPTZ)
```

**`groups` table**
```sql
- id (UUID, PK)
- activity_id (UUID, FK → activities, nullable) -- null if permanent group
- classroom_id (UUID, FK → classrooms)
- name (TEXT) -- e.g., "Group 1"
- is_permanent (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMPTZ)
```

**`group_members` table**
```sql
- id (UUID, PK)
- group_id (UUID, FK → groups)
- user_id (UUID, FK → profiles)
- is_leader (BOOLEAN, DEFAULT false)
- UNIQUE(group_id, user_id)
```

**`tasks` table**
```sql
- id (UUID, PK)
- group_id (UUID, FK → groups)
- activity_id (UUID, FK → activities)
- title (TEXT)
- description (TEXT, nullable)
- assigned_to (UUID, FK → profiles, nullable)
- status ('todo' | 'in_progress' | 'done')
- created_by (UUID, FK → profiles)
- created_at (TIMESTAMPTZ)
```

**`time_estimates` table** — the estimation matrix
```sql
- id (UUID, PK)
- task_id (UUID, FK → tasks)
- user_id (UUID, FK → profiles)
- estimated_hours (DECIMAL)
- UNIQUE(task_id, user_id)
```

**`submissions` table**
```sql
- id (UUID, PK)
- activity_id (UUID, FK → activities)
- user_id (UUID, FK → profiles, nullable) -- for individual
- group_id (UUID, FK → groups, nullable) -- for group
- content_text (TEXT, nullable) -- text/link
- file_url (TEXT, nullable) -- Supabase Storage URL
- file_name (TEXT, nullable)
- submitted_at (TIMESTAMPTZ)
- is_late (BOOLEAN, DEFAULT false)
```

**`ownership_transfers` table**
```sql
- id (UUID, PK)
- classroom_id (UUID, FK → classrooms)
- from_user_id (UUID, FK → profiles)
- to_user_id (UUID, FK → profiles)
- status ('pending' | 'accepted' | 'rejected')
- created_at (TIMESTAMPTZ)
```

**`notifications` table**
```sql
- id (UUID, PK)
- user_id (UUID, FK → profiles)
- type (TEXT) -- e.g., 'activity_posted', 'group_assigned', 'transfer_request'
- title (TEXT)
- message (TEXT)
- link (TEXT, nullable) -- where to navigate on click
- is_read (BOOLEAN, DEFAULT false)
- created_at (TIMESTAMPTZ)
```

---

### 3. Authentication & Onboarding

#### [NEW] `app/(auth)/login/page.tsx`
- Email + password login form
- Link to sign-up page
- Redirect to dashboard on success

#### [NEW] `app/(auth)/signup/page.tsx`
- Email, password, full name fields
- Role selector: "I'm a Student" / "I'm a Teacher" (card-based toggle)
- After sign-up, redirect to dashboard (or onboarding if joining via invite link)

#### [NEW] `app/(auth)/layout.tsx`
- Centered auth layout with Trippy Tropa branding
- Glassmorphism card on dark gradient background

#### [NEW] `app/join/[code]/page.tsx`
- Handles invite link routing: `/join/XK7M2P`
- If not logged in → redirect to sign-up with return URL
- If logged in + not yet member → check onboarding status → redirect to onboarding or join directly
- If already member → redirect to classroom

#### [NEW] `app/onboarding/[classroomId]/page.tsx`
- Skill assessment form for first-time classroom joiners
- Displays all skills the teacher configured for this classroom
- Slider or star rating (1-5) for each skill
- Submit → marks onboarding as complete → redirects to classroom

---

### 4. Dashboard

#### [NEW] `app/dashboard/page.tsx`
- **Teacher/Officer view**:
  - Grid of classroom cards (name, description, student count)
  - "Create Classroom" button (prominent CTA)
- **Student view**:
  - "Join Classroom" input (paste code) + join button
  - Grid of joined classroom cards
  - Upcoming activities/todos section with due dates

---

### 5. Classroom Management

#### [NEW] `app/classroom/create/page.tsx`
- Form: classroom name, description
- On submit → generates 6-char invite code → creates classroom
- Success state: shows QR code + invite link + copy button

#### [NEW] `app/classroom/[id]/page.tsx`
- **Teacher/Officer view**:
  - Student roster (list with role badges)
  - Activities list (cards with type badges: Individual/Group)
  - "Create Activity" button
  - "Show Invite" button → modal with QR code + link + code
  - "Skill Assessment Config" button → modal to add/edit/delete skills + multipliers
  - "Promote to Officer" action on student rows
  - "Transfer Ownership" in settings (if current user is owner)
  - "Create Permanent Groups" button (if not already created)
- **Student view**:
  - Activities list
  - Group info (if in permanent groups)

---

### 6. Activity Management

#### [NEW] `app/classroom/[id]/activity/create/page.tsx`
- Form: title, description, type (individual/group toggle), due date picker
- If group type: number of groups input
- Submit → creates activity

#### [NEW] `app/classroom/[id]/activity/[activityId]/page.tsx`
- **Individual activity (Teacher view)**: Description, submission list (who submitted / missing)
- **Individual activity (Student view)**: Description, submission form or "Submitted" status
- **Group activity (Teacher/Officer view)**:
  - Description, due date
  - If groups not yet created: "Generate Groups" button → runs Greedy LPT → shows preview/draft
  - Draft view: groups displayed as cards with member lists, drag-and-drop to reassign students between groups
  - "Confirm Groups" button to finalize
  - After confirmed: list of group cards (clickable) with member names and submission status
- **Group activity (Student view)**:
  - Description, due date
  - Their group info + members
  - Time estimation matrix (editable own row)
  - "Auto-Assign Tasks" button (visible to leader, runs Hungarian algorithm when all estimates filled)
  - Kanban board (after tasks assigned)

---

### 7. Group Detail Page

#### [NEW] `app/classroom/[id]/activity/[activityId]/group/[groupId]/page.tsx`
- **Teacher/Officer view (read-only)**:
  - Member list with leader badge
  - Time estimation matrix (view-only)
  - Kanban board (view-only)
  - Group submission
- **Student view (member of this group)**:
  - Member list
  - Time estimation matrix (own row editable if tasks not yet assigned)
  - "Auto-Assign Tasks" button (leader only, visible when all estimates filled)
  - Kanban board (can drag own tasks between columns)
  - Submission form (leader only)

---

### 8. Algorithms (Server Actions / API Routes)

#### [NEW] `lib/algorithms/greedy-lpt.ts`
```
Greedy LPT (Longest Processing Time) for balanced grouping:
1. Calculate overall skill score for each student: Σ(rating × multiplier) for all skills
2. Sort students by skill score descending (highest first)
3. Initialize N empty groups
4. For each student (in sorted order):
   - Place them in the group with the lowest current total score
5. Auto-assign leader: student with highest individual score in each group
6. Return group assignments as draft (preview)
```

#### [NEW] `lib/algorithms/hungarian.ts`
```
Hungarian Algorithm for optimal 1:1 task assignment:
1. Build cost matrix: rows = members, columns = tasks, cells = estimated hours
2. If matrix is not square, pad with dummy rows/columns (high cost values)
3. Run the Hungarian algorithm:
   a. Subtract row minimums
   b. Subtract column minimums
   c. Cover zeros with minimum lines
   d. If lines == n, optimal assignment found
   e. Otherwise, adjust matrix and repeat
4. Extract assignments: each member gets exactly one task
5. Return assignments
```

---

### 9. UI Design System

#### [NEW] `app/globals.css`
- CSS custom properties (design tokens):
  - Dark theme colors: `--bg-primary: #0a0a1a`, `--bg-secondary: #12122a`, `--bg-card: rgba(255,255,255,0.05)`
  - Accent colors: `--accent-primary: #6c5ce7`, `--accent-secondary: #00cec9`, `--accent-gradient`
  - Glassmorphism: `backdrop-filter: blur(20px)`, semi-transparent backgrounds, subtle borders
  - Typography: Inter font family, size scale
  - Shadows, borders, border-radius tokens
  - Transition/animation tokens

#### [NEW] Component Library
- `components/ui/Button.tsx` — primary, secondary, ghost variants with hover animations
- `components/ui/Card.tsx` — glassmorphism card with subtle glow on hover
- `components/ui/Input.tsx` — styled form inputs with floating labels
- `components/ui/Modal.tsx` — backdrop blur modal
- `components/ui/Badge.tsx` — role badges, status badges
- `components/ui/Sidebar.tsx` — collapsible sidebar with classroom list
- `components/ui/KanbanBoard.tsx` — drag-and-drop columns using @dnd-kit
- `components/ui/MatrixTable.tsx` — editable time estimation matrix
- `components/ui/QRCodeModal.tsx` — QR code display with copy link
- `components/ui/SkillRating.tsx` — 1-5 star/slider rating component

---

### 10. Layout & Navigation

#### [NEW] `app/(app)/layout.tsx`
- Authenticated layout with:
  - Collapsible sidebar (classrooms list, grouped by role)
  - Top header (Trippy Tropa logo, notifications bell, user avatar/menu)
  - Main content area

#### [NEW] `middleware.ts`
- Supabase auth middleware
- Protect all `/dashboard`, `/classroom` routes
- Redirect unauthenticated users to `/login`
- Handle invite link redirect flow

---

### 11. Supabase Configuration

#### [NEW] Row Level Security Policies
- **profiles**: Users can read/update their own profile
- **classrooms**: Owners and members can read; only owners can update/delete
- **classroom_members**: Members can read their classroom's members; owners can insert/update/delete
- **skills**: Members can read; owners/officers can insert/update/delete
- **student_skills**: Students can read/write their own; teachers can read all in their classrooms
- **activities**: Members can read; owners/officers can insert/update/delete
- **groups, group_members**: Members of the classroom can read; owners/officers can modify
- **tasks**: Group members can read; members can insert; leaders can delete
- **time_estimates**: Group members can read; members can write their own row
- **submissions**: Members can read; submitters can insert/update their own
- **notifications**: Users can only read/update their own

#### [NEW] Supabase Storage Bucket
- `submissions` bucket for file uploads
- RLS: authenticated users can upload; file access based on classroom membership

---

## File Structure

```
trippy-tropa-v2/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (app)/
│   │   ├── dashboard/page.tsx
│   │   ├── classroom/
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── settings/page.tsx
│   │   │       └── activity/
│   │   │           ├── create/page.tsx
│   │   │           └── [activityId]/
│   │   │               ├── page.tsx
│   │   │               └── group/
│   │   │                   └── [groupId]/page.tsx
│   │   └── layout.tsx
│   ├── join/[code]/page.tsx
│   ├── onboarding/[classroomId]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx (landing/redirect)
├── components/
│   ├── ui/ (Button, Card, Input, Modal, Badge, etc.)
│   ├── dashboard/ (ClassroomCard, TodoList, etc.)
│   ├── classroom/ (StudentRoster, ActivityList, InviteModal, SkillConfig, etc.)
│   ├── activity/ (GroupPreview, SubmissionForm, etc.)
│   └── group/ (KanbanBoard, TimeMatrix, MemberList, etc.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts (browser client)
│   │   ├── server.ts (server client)
│   │   └── middleware.ts
│   ├── algorithms/
│   │   ├── greedy-lpt.ts
│   │   └── hungarian.ts
│   ├── utils.ts (invite code generator, etc.)
│   └── types.ts (TypeScript interfaces)
├── supabase/
│   └── migrations/ (SQL migration files)
├── middleware.ts
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Verification Plan

### Automated Tests
- Unit tests for Greedy LPT algorithm with various student counts and group sizes
- Unit tests for Hungarian algorithm with various matrix sizes (including non-square)
- Test invite code generation for uniqueness

### Manual Verification
- **Auth flow**: Sign up as teacher → sign up as student → verify role-based dashboard
- **Classroom flow**: Create classroom → copy invite code → join as student → verify onboarding
- **Grouping flow**: Add 10+ students with skill ratings → run auto-group → verify balanced distribution → manually adjust → confirm
- **Task flow**: Leader creates tasks → all members fill time estimates → run Hungarian → verify optimal assignment → Kanban board works with drag-and-drop
- **Permission transfer**: Student officer creates classroom → teacher joins → officer transfers ownership → teacher accepts
- **Submission flow**: Submit for individual activity → submit for group activity (leader) → re-submit → verify file upload
- **Responsive design**: Test sidebar collapse, mobile layout

### Build Verification
```bash
npm run build  # Ensure no TypeScript/build errors
npm run lint   # Ensure no linting errors
```
