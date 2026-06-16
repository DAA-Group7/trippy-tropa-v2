import re

html_content = """<html class="scroll-smooth" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Smart Collaborative Group Management System</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .hero-gradient {
            background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, transparent 50%);
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = { ... }
    </script>
</head>
<body class="bg-background font-body-md text-on-surface antialiased">
<!-- Top Navigation Bar -->
<nav class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm h-20">
<div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center h-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">hub</span>
<span class="font-headline-md text-headline-md font-bold text-primary">Smart Grouping</span>
</div>
<div class="hidden md:flex gap-8 items-center">
<a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#features">Features</a>
<a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#how-it-works">How it Works</a>
<a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#roles">Roles</a>
<a class="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md" href="#pricing">Pricing</a>
</div>
<Link href="/login" class="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-80 transition-all active:scale-95">
                Get Started
            </Link>
</div>
</nav>
<!-- Hero Section -->
<section class="relative pt-40 pb-20 overflow-hidden hero-gradient">
<div class="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
<div class="space-y-stack-lg">
<h1 class="font-display-xl text-display-xl text-on-surface leading-tight">
                    Build Better Student Teams with <span class="text-primary">Smart Grouping</span> and Task Assignment
                </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                    Say goodbye to unfair workloads and random teams. Our platform uses advanced algorithms to create balanced groups and intelligently distribute tasks based on student skills.
                </p>
<div class="flex flex-wrap gap-4">
<Link href="/login" class="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        Get Started
                    </Link>
<button class="border border-outline text-on-surface px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-all">
                        Learn How It Works
                    </button>
</div>
</div>
<div class="relative">
<div class="animate-float glass-card p-4 rounded-2xl shadow-2xl relative z-10">
<img alt="Collaboration Illustration" class="rounded-xl w-full" data-alt="A diverse group of university students collaborating around a sleek, modern workstation with transparent digital interfaces showing data visualizations and algorithmic network connections. The lighting is bright and professional, with a cool blue and white primary palette that conveys a high-tech educational environment. The atmosphere is productive and innovative." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAInrtK0GCbehNFhLnPtw4uqV6PpwTwGVQdyxWKow8P9VT65HF2u_9DqTMpQ4lPwz93nNoGNMS3GnQQRTdk0l1bXHVGe4LClG3s8JOWCRhDaUiufoV0LCpWB4YrkZlLqPNThTj09xK32PqpqdwadFMKd_IyLf2WJhhFG34coy05P9VsAQJbm4eKUtq832HMAoaUdrloed1iFP2lUi3hZOR2iA91CXtox2ohDp2EX27Rm1UKzEfxCv5S-rI7hmVNQEpCoVVUxRuft0P8"/>
</div>
<div class="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 blur-3xl rounded-full"></div>
<div class="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 blur-3xl rounded-full"></div>
</div>
</div>
</section>
<!-- Problem Section -->
<section class="py-section-gap bg-surface">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="text-center mb-16 space-y-4">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Group Work Shouldn't Be Random</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Traditional group formation leads to friction and poor outcomes. We solve the common pitfalls of classroom collaboration.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div class="p-8 rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
<div class="w-12 h-12 bg-error/10 text-error rounded-lg flex items-center justify-center mb-6">
<span class="material-symbols-outlined">balance</span>
</div>
<h3 class="font-headline-md text-headline-md mb-3">Unbalanced Groups</h3>
<p class="text-on-surface-variant">Top performers often end up in the same group, while others struggle without guidance or leadership.</p>
</div>
<div class="p-8 rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
<div class="w-12 h-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-6">
<span class="material-symbols-outlined">assignment_late</span>
</div>
<h3 class="font-headline-md text-headline-md mb-3">Poor Task Distribution</h3>
<p class="text-on-surface-variant">Tasks are often assigned to students who lack the specific skills required, leading to frustration and delays.</p>
</div>
<div class="p-8 rounded-2xl bg-white border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
<div class="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
<span class="material-symbols-outlined">group_off</span>
</div>
<h3 class="font-headline-md text-headline-md mb-3">Unequal Workloads</h3>
<p class="text-on-surface-variant">The "Free Rider" problem persists when workloads aren't tracked or assigned based on fair time estimates.</p>
</div>
</div>
</div>
</section>
<!-- Solution Section - Workflow -->
<section class="py-section-gap bg-surface-container-low overflow-hidden" id="how-it-works">
<div class="max-w-container-max mx-auto px-margin-desktop">
<h2 class="font-headline-lg text-headline-lg text-on-surface text-center mb-16">A Smarter Way to Manage Group Projects</h2>
<div class="relative">
<div class="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/30 -translate-y-1/2 z-0"></div>
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-gutter relative z-10">
<!-- Workflow Steps -->
<div class="text-center space-y-4">
<div class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-lg">1</div>
<h4 class="font-label-md text-label-md font-bold">Create Classroom</h4>
</div>
<div class="text-center space-y-4">
<div class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-lg">2</div>
<h4 class="font-label-md text-label-md font-bold">Join &amp; Profile</h4>
</div>
<div class="text-center space-y-4">
<div class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-lg">3</div>
<h4 class="font-label-md text-label-md font-bold">Skill Assessment</h4>
</div>
<div class="text-center space-y-4">
<div class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-lg">4</div>
<h4 class="font-label-md text-label-md font-bold">Smart Grouping</h4>
</div>
<div class="text-center space-y-4">
<div class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-lg">5</div>
<h4 class="font-label-md text-label-md font-bold">Task Optimization</h4>
</div>
<div class="text-center space-y-4">
<div class="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto shadow-lg">6</div>
<h4 class="font-label-md text-label-md font-bold">Collaboration</h4>
</div>
</div>
</div>
</div>
</section>
<!-- Algorithm Visuals (Group Balancing) -->
<section class="py-section-gap bg-white">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
<div>
<h2 class="font-headline-lg text-headline-lg mb-6">Balanced Teams with <span class="text-primary">Greedy Algorithm</span></h2>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-8">
                        Our system ranks students by their aggregate skill scores and distributes them across groups to ensure each team has a similar "strength level." This prevents "power groups" and ensures every group has a fair chance at success.
                    </p>
<ul class="space-y-4">
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">check_circle</span>
<span>Fair distribution of high-performers</span>
</li>
<li class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">check_circle</span>
<span>Consistent group skill averages</span>
</li>
</ul>
</div>
<div class="p-8 bg-surface-container rounded-3xl">
<div class="grid grid-cols-3 gap-4 mb-8">
<div class="bg-white p-4 rounded-xl shadow-sm text-center border border-primary/20">
<p class="text-label-sm font-bold text-primary">Anna</p>
<p class="text-headline-md">95</p>
</div>
<div class="bg-white p-4 rounded-xl shadow-sm text-center">
<p class="text-label-sm font-bold">John</p>
<p class="text-headline-md">90</p>
</div>
<div class="bg-white p-4 rounded-xl shadow-sm text-center border border-primary/20">
<p class="text-label-sm font-bold text-primary">Mia</p>
<p class="text-headline-md">88</p>
</div>
</div>
<div class="flex justify-between items-center px-10">
<div class="w-1 h-12 border-l-2 border-dashed border-primary"></div>
<div class="w-1 h-12 border-l-2 border-dashed border-primary"></div>
<div class="w-1 h-12 border-l-2 border-dashed border-primary"></div>
</div>
<div class="grid grid-cols-2 gap-6 mt-8">
<div class="bg-primary/5 p-6 rounded-2xl border border-primary/10">
<p class="font-bold mb-2">Group A</p>
<div class="flex justify-between text-sm">
<span>Total Score:</span>
<span class="font-bold text-primary">264</span>
</div>
</div>
<div class="bg-primary/5 p-6 rounded-2xl border border-primary/10">
<p class="font-bold mb-2">Group B</p>
<div class="flex justify-between text-sm">
<span>Total Score:</span>
<span class="font-bold text-primary">262</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Algorithm Visuals (Task Assignment) -->
<section class="py-section-gap bg-surface-container-low">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
<div class="order-2 lg:order-1 glass-card p-8 rounded-3xl">
<h4 class="font-bold mb-6 text-center">Time Estimation Matrix (Hours)</h4>
<div class="overflow-x-auto">
<table class="w-full text-center">
<thead>
<tr class="border-b border-outline-variant">
<th class="py-3 px-4"></th>
<th class="py-3 px-4 font-label-md">Research</th>
<th class="py-3 px-4 font-label-md">Design</th>
<th class="py-3 px-4 font-label-md">Code</th>
</tr>
</thead>
<tbody>
<tr>
<td class="py-3 font-bold text-primary">Anna</td>
<td class="py-3">2h</td>
<td class="py-3 bg-primary/10 rounded-lg text-primary font-bold">1h</td>
<td class="py-3">4h</td>
</tr>
<tr>
<td class="py-3 font-bold text-primary">John</td>
<td class="py-3 bg-primary/10 rounded-lg text-primary font-bold">2h</td>
<td class="py-3">3h</td>
<td class="py-3">5h</td>
</tr>
<tr>
<td class="py-3 font-bold text-primary">Mia</td>
<td class="py-3">4h</td>
<td class="py-3">2h</td>
<td class="py-3 bg-primary/10 rounded-lg text-primary font-bold">1h</td>
</tr>
</tbody>
</table>
</div>
<div class="mt-8 p-4 bg-primary text-on-primary rounded-xl text-center font-bold">
                        Hungarian Algorithm: Optimal Time 4h Total
                    </div>
</div>
<div class="order-1 lg:order-2">
<h2 class="font-headline-lg text-headline-lg mb-6">Optimized Task Assignment with <span class="text-primary">Hungarian Algorithm</span></h2>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-8">
                        Efficiency is about matching the right person with the right task. Our Hungarian Algorithm integration analyzes student proficiency and time estimates to assign tasks that minimize project duration and maximize output.
                    </p>
<div class="grid grid-cols-2 gap-4">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary">speed</span>
<div>
<p class="font-bold">Fastest Completion</p>
<p class="text-sm text-on-surface-variant">Minimizes the bottleneck tasks.</p>
</div>
</div>
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-primary">psychology</span>
<div>
<p class="font-bold">Skill Matching</p>
<p class="text-sm text-on-surface-variant">Prioritizes student expertise.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Features Bento Grid -->
<section class="py-section-gap bg-white" id="features">
<div class="max-w-container-max mx-auto px-margin-desktop">
<h2 class="font-headline-lg text-headline-lg text-center mb-16">All-in-One Collaboration Suite</h2>
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
<div class="md:col-span-2 p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between">
<div>
<span class="material-symbols-outlined text-primary mb-4">school</span>
<h3 class="font-headline-md text-headline-md mb-2">Classroom Management</h3>
<p class="text-on-surface-variant">Centralized hub for all your group projects. Manage multiple classes, enroll students, and monitor progress from a single dashboard.</p>
</div>
<div class="mt-8 p-4 bg-white rounded-xl shadow-sm">
<div class="flex justify-between items-center mb-2">
<span class="text-sm font-bold">CS101: Web Dev</span>
<span class="text-xs text-primary px-2 py-0.5 bg-primary/10 rounded-full">Active</span>
</div>
<div class="w-full bg-surface-container rounded-full h-2">
<div class="bg-primary h-2 rounded-full w-3/4"></div>
</div>
</div>
</div>
<div class="p-8 rounded-3xl bg-surface-container border border-outline-variant/30">
<span class="material-symbols-outlined text-primary mb-4">analytics</span>
<h3 class="font-headline-md text-headline-md mb-2">Skill Assessment</h3>
<p class="text-on-surface-variant text-sm">Dynamic profiling based on past performance and self-assessments.</p>
</div>
<div class="p-8 rounded-3xl bg-primary text-on-primary">
<span class="material-symbols-outlined mb-4">view_kanban</span>
<h3 class="font-headline-md text-headline-md mb-2">Kanban Board</h3>
<p class="text-primary-fixed-dim text-sm">Real-time task tracking with auto-assignment triggers.</p>
</div>
<div class="p-8 rounded-3xl border border-outline-variant/30">
<span class="material-symbols-outlined text-primary mb-4">monitoring</span>
<h3 class="font-headline-md text-headline-md mb-2">Teacher Dashboard</h3>
<p class="text-on-surface-variant text-sm">Get insights into individual contributions and group health metrics.</p>
</div>
<div class="md:col-span-2 p-8 rounded-3xl bg-surface-container-highest border border-outline-variant/30 flex items-center gap-8">
<div class="flex-1">
<h3 class="font-headline-md text-headline-md mb-2">AI-Powered Optimization</h3>
<p class="text-on-surface-variant">Continuously refines group balance as student performance evolves throughout the semester.</p>
</div>
<div class="hidden sm:block w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-primary text-5xl">auto_fix_high</span>
</div>
</div>
<div class="p-8 rounded-3xl border border-outline-variant/30">
<span class="material-symbols-outlined text-primary mb-4">notifications_active</span>
<h3 class="font-headline-md text-headline-md mb-2">Smart Alerts</h3>
<p class="text-on-surface-variant text-sm">Automatic nudges for lagging tasks and missed milestones.</p>
</div>
</div>
</div>
</section>
<!-- User Roles -->
<section class="py-section-gap bg-surface" id="roles">
<div class="max-w-container-max mx-auto px-margin-desktop">
<h2 class="font-headline-lg text-headline-lg text-center mb-16">Tailored for Every Role</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div class="p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/20 hover:-translate-y-2 transition-transform">
<div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-3xl">supervisor_account</span>
</div>
<h3 class="font-headline-md text-headline-md mb-4">Teacher</h3>
<ul class="space-y-3 text-on-surface-variant">
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Define project parameters</li>
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Review group compositions</li>
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Assess final contributions</li>
</ul>
</div>
<div class="p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/20 hover:-translate-y-2 transition-transform">
<div class="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-3xl">military_tech</span>
</div>
<h3 class="font-headline-md text-headline-md mb-4">Student Officer</h3>
<ul class="space-y-3 text-on-surface-variant">
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Manage team meetings</li>
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Oversee Kanban board</li>
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Report group progress</li>
</ul>
</div>
<div class="p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/20 hover:-translate-y-2 transition-transform">
<div class="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center mb-6">
<span class="material-symbols-outlined text-3xl">person</span>
</div>
<h3 class="font-headline-md text-headline-md mb-4">Student</h3>
<ul class="space-y-3 text-on-surface-variant">
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Log skill assessments</li>
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Receive optimized tasks</li>
<li class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">check</span> Collaborate in real-time</li>
</ul>
</div>
</div>
</div>
</section>
<!-- Testimonials -->
<section class="py-section-gap bg-white" id="pricing">
<div class="max-w-container-max mx-auto px-margin-desktop">
<h2 class="font-headline-lg text-headline-lg text-center mb-16">Trusted by Educators &amp; Students</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div class="p-10 rounded-3xl bg-surface-container-low relative">
<span class="material-symbols-outlined text-primary/20 text-7xl absolute top-8 left-8">format_quote</span>
<div class="relative z-10">
<p class="font-body-lg text-body-lg mb-8 italic text-on-surface-variant">
                            "Before this system, group assignments were a grading nightmare. Now, I have clear visibility into who is doing what, and the teams are much more harmonious."
                        </p>
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-primary/20"></div>
<div>
<p class="font-bold">Dr. Sarah Mitchell</p>
<p class="text-sm text-on-surface-variant">Professor of Computer Science</p>
</div>
</div>
</div>
</div>
<div class="p-10 rounded-3xl bg-surface-container-low relative">
<span class="material-symbols-outlined text-primary/20 text-7xl absolute top-8 left-8">format_quote</span>
<div class="relative z-10">
<p class="font-body-lg text-body-lg mb-8 italic text-on-surface-variant">
                            "I love how the system identified my strengths in UI design and assigned me relevant tasks. It made the project feel like a real professional experience."
                        </p>
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-secondary/20"></div>
<div>
<p class="font-bold">Liam Peterson</p>
<p class="text-sm text-on-surface-variant">3rd Year Student</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Final CTA -->
<section class="py-section-gap">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-on-primary relative overflow-hidden">
<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
<h2 class="font-display-xl text-display-xl mb-8 relative z-10">Transform the Way Students Work Together</h2>
<p class="text-body-lg font-body-lg mb-12 max-w-2xl mx-auto opacity-90 relative z-10">
                    Join hundreds of classrooms already using smart algorithms to power their collaborative learning environments.
                </p>
<div class="flex flex-wrap justify-center gap-6 relative z-10">
<Link href="/login" class="bg-white text-primary px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-transform">
                        Create a Classroom
                    </Link>
<button class="border border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-colors">
                        Request a Demo
                    </button>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="w-full py-section-gap bg-surface-container-low border-t border-outline-variant/30">
<div class="max-w-container-max mx-auto px-margin-desktop">
<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter mb-16">
<div class="col-span-2 space-y-6">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-3xl" style="font-variation-settings: 'FILL' 1;">hub</span>
<span class="font-headline-md text-headline-md font-bold text-primary">Smart Grouping</span>
</div>
<p class="text-on-surface-variant max-w-xs">Empowering education through intelligent collaborative tools and algorithmic efficiency.</p>
</div>
<div class="space-y-4">
<h4 class="font-bold">Product</h4>
<ul class="space-y-2">
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Features</a></li>
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Pricing</a></li>
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">How it Works</a></li>
</ul>
</div>
<div class="space-y-4">
<h4 class="font-bold">Company</h4>
<ul class="space-y-2">
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">About Us</a></li>
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Careers</a></li>
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Blog</a></li>
</ul>
</div>
<div class="space-y-4">
<h4 class="font-bold">Legal</h4>
<ul class="space-y-2">
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Privacy Policy</a></li>
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Terms of Service</a></li>
<li><a class="text-on-surface-variant hover:text-primary transition-colors text-label-md" href="#">Cookie Policy</a></li>
</ul>
</div>
<div class="space-y-4">
<h4 class="font-bold">Social</h4>
<div class="flex gap-4">
<a class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors" href="#">
<img class="w-6 h-6 rounded-sm" data-alt="Social media logo for Twitter or X in a clean minimalist style, white on transparent background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuADRsTVzuBnzRJgKVNnmn75SF7RNNSoLx88z-dPqVcTH-HXfiJ5oRUl_Kv4WleswsAccmJcmxHnGdX8-wUiTFgepISfgSGreKckBpgItqBHWmD01dGeJRmBZkVEA3IlLD34SBRsjaP3iyz49G7bk3CvQsV4MSwA-n9cjxBA-XzapfItOYrmbceQbG1J9fCTt2C95nghU9g4JaWOdZwawWwqV-pZM02eaxB64um5OO0zt-kOK0WtB-s2HJb1xDYBuui31VPp7bgcPnCX"/>
</a>
<a class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors" href="#">
<img class="w-6 h-6 rounded-sm" data-alt="Social media logo for LinkedIn in a professional minimalist style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB002610L70wTFwJ62JM0oHBSsuA8YFw0fO1H1qJfBzbnsSisQ50ENnwLvpgcn7RraRfouhJBvPJA_idNODBmaNHdTWmZZ1MqINXSIuMDOKgkX0tyN0bjrdbkLa5ZEAMi6t3XHLAQgqPcLS2zGrBuZb1l7a4YWp7ak7bQoAHKur9QrssGmvA7-8X4RTEOalN99tRhbnSOVAcgyn5bOpSer5CL-3AW8ML0Fj8Y5pc0BAa5_deW3JnLvLASoG2ffqovDC82SS1q3TZVm"/>
</a>
</div>
</div>
</div>
<div class="border-t border-outline-variant/20 pt-8 text-center text-on-surface-variant text-label-md">
                © 2024 Smart Collaborative Group Management System. All rights reserved.
            </div>
</div>
</footer>
</body></html>"""

mappings = {
    'bg-background': 'bg-[#faf8ff]',
    'text-on-surface': 'text-[#131b2e]',
    'font-body-md text-body-md': "font-['Inter'] text-[16px] leading-[24px]",
    'bg-surface/80': 'bg-[#faf8ff]/80',
    'border-outline-variant/20': 'border-[#c3c6d7]/20',
    'max-w-container-max': 'max-w-[1200px]',
    'px-margin-desktop': 'px-6 md:px-[48px]',
    'text-primary': 'text-[#004ac6]',
    'font-headline-md text-headline-md': "font-['Inter'] font-semibold text-[24px] leading-[32px]",
    'text-on-surface-variant': 'text-[#434655]',
    'font-label-md text-label-md': "font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em]",
    'bg-primary': 'bg-[#004ac6]',
    'text-on-primary': 'text-[#ffffff]',
    'gap-gutter': 'gap-4 md:gap-[24px]',
    'space-y-stack-lg': 'space-y-[32px]',
    'font-display-xl text-display-xl': "font-['Inter'] font-bold text-4xl md:text-[60px] md:leading-[72px] tracking-[-0.02em]",
    'font-body-lg text-body-lg': "font-['Inter'] font-normal text-[18px] leading-[28px]",
    'border-outline': 'border-[#737686]',
    'hover:bg-surface-container-low': 'hover:bg-[#f2f3ff]',
    'bg-secondary/10': 'bg-[#006686]/10',
    'bg-error/10': 'bg-[#ba1a1a]/10',
    'text-error': 'text-[#ba1a1a]',
    'text-secondary': 'text-[#006686]',
    'py-section-gap': 'py-20 md:py-[120px]',
    'bg-surface': 'bg-[#faf8ff]',
    'font-headline-lg text-headline-lg': "font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em]",
    'border-outline-variant/30': 'border-[#c3c6d7]/30',
    'bg-surface-container-low': 'bg-[#f2f3ff]',
    'bg-surface-container': 'bg-[#eaedff]',
    'text-label-sm text-label-sm': "font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[0.05em]",
    'text-label-sm': "font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[0.05em]",
    'bg-surface-container-highest': 'bg-[#dae2fd]',
    'text-primary-fixed-dim': 'text-[#b4c5ff]',
    'bg-tertiary/10': 'bg-[#525657]/10',
    'text-tertiary': 'text-[#525657]',
    'font-bold': 'font-bold',
    'class=': 'className=',
    'style="font-variation-settings: \'FILL\' 1;"': "style={{ fontVariationSettings: \"'FILL' 1\" }}",
}

for k, v in mappings.items():
    html_content = html_content.replace(k, v)

# remove script tags and head tags
html_content = re.sub(r'<head>.*?</head>', '', html_content, flags=re.DOTALL)
html_content = re.sub(r'<html.*?>', '', html_content, flags=re.DOTALL)
html_content = re.sub(r'</html>', '', html_content, flags=re.DOTALL)
html_content = re.sub(r'<body(.*?)>', r'<div\1>', html_content, flags=re.DOTALL)
html_content = re.sub(r'</body>', '</div>', html_content, flags=re.DOTALL)

# Ensure img tags are closed
html_content = re.sub(r'(<img[^>]*?)(?<!/)>', r'\1 />', html_content)
# Ensure input tags are closed (none here but just in case)
html_content = re.sub(r'(<input[^>]*?)(?<!/)>', r'\1 />', html_content)

jsx_content = f"""'use client';
import Link from 'next/link';
import {{ useEffect }} from 'react';
import {{ Inter }} from 'next/font/google';

const inter = Inter({{ subsets: ['latin'], display: 'swap' }});

export default function LandingPage() {{
  useEffect(() => {{
    const observerOptions = {{
      threshold: 0.1
    }};

    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }}
      }});
    }}, observerOptions);

    document.querySelectorAll('section').forEach(section => {{
      section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    }});
    
    return () => observer.disconnect();
  }}, []);

  return (
    <div className={{inter.className}}>
      <style dangerouslySetInnerHTML={{{{
        __html: `
          .material-symbols-outlined {{
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }}
          .glass-card {{
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(226, 232, 240, 0.8);
          }}
          .hero-gradient {{
            background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, transparent 50%);
          }}
          @keyframes float {{
            0% {{ transform: translateY(0px); }}
            50% {{ transform: translateY(-10px); }}
            100% {{ transform: translateY(0px); }}
          }}
          .animate-float {{
            animation: float 6s ease-in-out infinite;
          }}
        `
      }}}} />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      {html_content}
    </div>
  );
}}
"""

with open('c:\\Users\\QC-SDO\\Desktop\\trippy-tropa-v2\\src\\app\\page.tsx', 'w', encoding='utf-8') as f:
    f.write(jsx_content)

print("Done generating landing page!")
