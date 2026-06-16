'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function LandingPage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      section.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={inter.className}>
      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      
<div className="bg-[#faf8ff] font-body-md text-[#131b2e] antialiased">

<nav className="fixed top-0 w-full z-50 bg-[#faf8ff]/80 backdrop-blur-xl border-b border-[#c3c6d7]/20 shadow-sm h-20">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px] flex justify-between items-center h-full">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#004ac6] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
<span className="font-['Inter'] font-semibold text-[24px] leading-[32px] font-bold text-[#004ac6]">Trippy Tropa</span>
</div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em]" href="#features">Features</a>
<a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em]" href="#how-it-works">How it Works</a>
<a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em]" href="#roles">Roles</a>
</div>
<Link href="/login" className="bg-[#004ac6] text-[#ffffff] px-6 py-2.5 rounded-full font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] hover:opacity-80 transition-all active:scale-95">
                Get Started
            </Link>
</div>
</nav>

<section className="relative pt-40 pb-20 overflow-hidden hero-gradient">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px] grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-[24px] items-center">
<div className="space-y-[32px]">
<h1 className="font-['Inter'] font-bold text-4xl md:text-[60px] md:leading-[72px] tracking-[-0.02em] text-[#131b2e] leading-tight">
                    Build Better Student Teams with <span className="text-[#004ac6]">Trippy Tropa</span> and Task Assignment
                </h1>
<p className="font-['Inter'] font-normal text-[18px] leading-[28px] text-[#131b2e]-variant max-w-xl">
                    Say goodbye to unfair workloads and random teams. Our platform uses advanced algorithms to create balanced groups and intelligently distribute tasks based on student skills.
                </p>
<div className="flex flex-wrap gap-4">
<Link href="/login" className="bg-[#004ac6] text-[#ffffff] px-8 py-4 rounded-xl font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center">
                        Get Started
                    </Link>
<a href="#how-it-works" className="border border-[#737686] text-[#131b2e] px-8 py-4 rounded-xl font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] hover:bg-[#f2f3ff] transition-all text-center">
                        Learn How It Works
                    </a>
</div>
</div>
<div className="relative">
<div className="animate-float glass-card p-4 rounded-2xl shadow-2xl relative z-10">
<img alt="Collaboration Illustration" className="rounded-xl w-full" data-alt="A diverse group of university students collaborating around a sleek, modern workstation with transparent digital interfaces showing data visualizations and algorithmic network connections. The lighting is bright and professional, with a cool blue and white primary palette that conveys a high-tech educational environment. The atmosphere is productive and innovative." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAInrtK0GCbehNFhLnPtw4uqV6PpwTwGVQdyxWKow8P9VT65HF2u_9DqTMpQ4lPwz93nNoGNMS3GnQQRTdk0l1bXHVGe4LClG3s8JOWCRhDaUiufoV0LCpWB4YrkZlLqPNThTj09xK32PqpqdwadFMKd_IyLf2WJhhFG34coy05P9VsAQJbm4eKUtq832HMAoaUdrloed1iFP2lUi3hZOR2iA91CXtox2ohDp2EX27Rm1UKzEfxCv5S-rI7hmVNQEpCoVVUxRuft0P8"/>
</div>
<div className="absolute -top-10 -right-10 w-48 h-48 bg-[#004ac6]/10 blur-3xl rounded-full"></div>
<div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#006686]/10 blur-3xl rounded-full"></div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-[#faf8ff]">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<div className="text-center mb-16 space-y-4">
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] text-[#131b2e]">Group Work Shouldn't Be Random</h2>
<p className="font-['Inter'] font-normal text-[18px] leading-[28px] text-[#131b2e]-variant max-w-2xl mx-auto">Traditional group formation leads to friction and poor outcomes. We solve the common pitfalls of classroom collaboration.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[24px]">
<div className="p-8 rounded-2xl bg-white border border-[#737686]-variant/30 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-lg flex items-center justify-center mb-6">
<span className="material-symbols-outlined">balance</span>
</div>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-3">Unbalanced Groups</h3>
<p className="text-[#131b2e]-variant">Top performers often end up in the same group, while others struggle without guidance or leadership.</p>
</div>
<div className="p-8 rounded-2xl bg-white border border-[#737686]-variant/30 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 bg-[#006686]/10 text-[#006686] rounded-lg flex items-center justify-center mb-6">
<span className="material-symbols-outlined">assignment_late</span>
</div>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-3">Poor Task Distribution</h3>
<p className="text-[#131b2e]-variant">Tasks are often assigned to students who lack the specific skills required, leading to frustration and delays.</p>
</div>
<div className="p-8 rounded-2xl bg-white border border-[#737686]-variant/30 shadow-sm hover:shadow-md transition-shadow">
<div className="w-12 h-12 bg-[#004ac6]/10 text-[#004ac6] rounded-lg flex items-center justify-center mb-6">
<span className="material-symbols-outlined">group_off</span>
</div>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-3">Unequal Workloads</h3>
<p className="text-[#131b2e]-variant">The "Free Rider" problem persists when workloads aren't tracked or assigned based on fair time estimates.</p>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-[#faf8ff]-container-low overflow-hidden" id="how-it-works">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] text-[#131b2e] text-center mb-16">A Smarter Way to Manage Group Projects</h2>
<div className="relative">
<div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/30 -translate-y-1/2 z-0"></div>
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-[24px] relative z-10">

<div className="text-center space-y-4">
<div className="w-16 h-16 bg-[#004ac6] text-[#ffffff] rounded-full flex items-center justify-center mx-auto shadow-lg">1</div>
<h4 className="font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] font-bold">Create Classroom</h4>
</div>
<div className="text-center space-y-4">
<div className="w-16 h-16 bg-[#004ac6] text-[#ffffff] rounded-full flex items-center justify-center mx-auto shadow-lg">2</div>
<h4 className="font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] font-bold">Join &amp; Profile</h4>
</div>
<div className="text-center space-y-4">
<div className="w-16 h-16 bg-[#004ac6] text-[#ffffff] rounded-full flex items-center justify-center mx-auto shadow-lg">3</div>
<h4 className="font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] font-bold">Skill Assessment</h4>
</div>
<div className="text-center space-y-4">
<div className="w-16 h-16 bg-[#004ac6] text-[#ffffff] rounded-full flex items-center justify-center mx-auto shadow-lg">4</div>
<h4 className="font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] font-bold">Intelligent Grouping</h4>
</div>
<div className="text-center space-y-4">
<div className="w-16 h-16 bg-[#004ac6] text-[#ffffff] rounded-full flex items-center justify-center mx-auto shadow-lg">5</div>
<h4 className="font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] font-bold">Task Optimization</h4>
</div>
<div className="text-center space-y-4">
<div className="w-16 h-16 bg-[#004ac6] text-[#ffffff] rounded-full flex items-center justify-center mx-auto shadow-lg">6</div>
<h4 className="font-['Inter'] font-medium text-[14px] leading-[20px] tracking-[0.01em] font-bold">Collaboration</h4>
</div>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-white">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
<div>
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] mb-6">Interactive <span className="text-[#004ac6]">Group Draft Board</span></h2>
<p className="font-['Inter'] font-normal text-[18px] leading-[28px] text-[#131b2e]-variant mb-8">
                        Our system provides a visually intuitive drafting interface where teachers can seamlessly manage, shuffle, and finalize group compositions based on students' self-assessed skill scores before officially publishing them to the class.
                    </p>
<ul className="space-y-4">
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#004ac6]">check_circle</span>
<span>Visual Drag-and-Drop Management</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-[#004ac6]">check_circle</span>
<span>Real-time Group Health Metrics</span>
</li>
</ul>
</div>
<div className="p-8 bg-[#faf8ff]-container rounded-3xl">
<div className="grid grid-cols-3 gap-4 mb-8">
<div className="bg-white p-4 rounded-xl shadow-sm text-center border border-primary/20">
<p className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[0.05em] font-bold text-[#004ac6]">Anna</p>
<p className="text-headline-md">95</p>
</div>
<div className="bg-white p-4 rounded-xl shadow-sm text-center">
<p className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[0.05em] font-bold">John</p>
<p className="text-headline-md">90</p>
</div>
<div className="bg-white p-4 rounded-xl shadow-sm text-center border border-primary/20">
<p className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[0.05em] font-bold text-[#004ac6]">Mia</p>
<p className="text-headline-md">88</p>
</div>
</div>
<div className="flex justify-between items-center px-10">
<div className="w-1 h-12 border-l-2 border-dashed border-primary"></div>
<div className="w-1 h-12 border-l-2 border-dashed border-primary"></div>
<div className="w-1 h-12 border-l-2 border-dashed border-primary"></div>
</div>
<div className="grid grid-cols-2 gap-6 mt-8">
<div className="bg-[#004ac6]/5 p-6 rounded-2xl border border-primary/10">
<p className="font-bold mb-2">Group A</p>
<div className="flex justify-between text-sm">
<span>Total Score:</span>
<span className="font-bold text-[#004ac6]">264</span>
</div>
</div>
<div className="bg-[#004ac6]/5 p-6 rounded-2xl border border-primary/10">
<p className="font-bold mb-2">Group B</p>
<div className="flex justify-between text-sm">
<span>Total Score:</span>
<span className="font-bold text-[#004ac6]">262</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-[#faf8ff]-container-low">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
<div className="order-2 lg:order-1 glass-card p-8 rounded-3xl">
<h4 className="font-bold mb-6 text-center">Time Estimation Matrix (Hours)</h4>
<div className="overflow-x-auto">
<table className="w-full text-center">
<thead>
<tr className="border-b border-[#737686]-variant">
<th className="py-3 px-4"></th>
<th className="py-3 px-4 font-label-md">Research</th>
<th className="py-3 px-4 font-label-md">Design</th>
<th className="py-3 px-4 font-label-md">Code</th>
</tr>
</thead>
<tbody>
<tr>
<td className="py-3 font-bold text-[#004ac6]">Anna</td>
<td className="py-3">2h</td>
<td className="py-3 bg-[#004ac6]/10 rounded-lg text-[#004ac6] font-bold">1h</td>
<td className="py-3">4h</td>
</tr>
<tr>
<td className="py-3 font-bold text-[#004ac6]">John</td>
<td className="py-3 bg-[#004ac6]/10 rounded-lg text-[#004ac6] font-bold">2h</td>
<td className="py-3">3h</td>
<td className="py-3">5h</td>
</tr>
<tr>
<td className="py-3 font-bold text-[#004ac6]">Mia</td>
<td className="py-3">4h</td>
<td className="py-3">2h</td>
<td className="py-3 bg-[#004ac6]/10 rounded-lg text-[#004ac6] font-bold">1h</td>
</tr>
</tbody>
</table>
</div>
<div className="mt-8 p-4 bg-[#004ac6] text-[#ffffff] rounded-xl text-center font-bold">
                        Fair Workload Distribution: Optimal Time 4h Total
                    </div>
</div>
<div className="order-1 lg:order-2">
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] mb-6">Collaborative <span className="text-[#004ac6]">Estimation Matrix</span></h2>
<p className="font-['Inter'] font-normal text-[18px] leading-[28px] text-[#131b2e]-variant mb-8">
                        Efficiency is about matching the right person with the right task. Our Collaborative Estimation Matrix empowers each student to input their estimated hours for tasks, allowing Student Officers to assign work fairly based on true capacity.
                    </p>
<div className="grid grid-cols-2 gap-4">
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#004ac6]">speed</span>
<div>
<p className="font-bold">Transparent Workloads</p>
<p className="text-sm text-[#131b2e]-variant">Visualizes everyone's capacity.</p>
</div>
</div>
<div className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#004ac6]">psychology</span>
<div>
<p className="font-bold">Peer-Led Assignments</p>
<p className="text-sm text-[#131b2e]-variant">Officers assign based on data.</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-white" id="features">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] text-center mb-16">All-in-One Collaboration Suite</h2>
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[24px]">
<div className="md:col-span-2 p-8 rounded-3xl bg-[#faf8ff]-container-low border border-[#737686]-variant/30 flex flex-col justify-between">
<div>
<span className="material-symbols-outlined text-[#004ac6] mb-4">school</span>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-2">Classroom Management</h3>
<p className="text-[#131b2e]-variant">Centralized hub for all your group projects. Manage multiple classes, enroll students, and monitor progress from a single dashboard.</p>
</div>
<div className="mt-8 p-4 bg-white rounded-xl shadow-sm">
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-bold">CS101: Web Dev</span>
<span className="text-xs text-[#004ac6] px-2 py-0.5 bg-[#004ac6]/10 rounded-full">Active</span>
</div>
<div className="w-full bg-[#faf8ff]-container rounded-full h-2">
<div className="bg-[#004ac6] h-2 rounded-full w-3/4"></div>
</div>
</div>
</div>
<div className="p-8 rounded-3xl bg-[#faf8ff]-container border border-[#737686]-variant/30">
<span className="material-symbols-outlined text-[#004ac6] mb-4">analytics</span>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-2">Skill Assessment</h3>
<p className="text-[#131b2e]-variant text-sm">Dynamic profiling based on past performance and self-assessments.</p>
</div>
<div className="p-8 rounded-3xl bg-[#004ac6] text-[#ffffff]">
<span className="material-symbols-outlined mb-4">view_kanban</span>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-2">Kanban Board</h3>
<p className="text-[#b4c5ff] text-sm">Real-time drag-and-drop workflow with GitHub link submissions.</p>
</div>
<div className="p-8 rounded-3xl border border-[#737686]-variant/30">
<span className="material-symbols-outlined text-[#004ac6] mb-4">monitoring</span>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-2">Teacher Dashboard</h3>
<p className="text-[#434655] text-sm">Monitor At Risk Students and track Class Average Scores in real-time.</p>
</div>
<div className="md:col-span-2 p-8 rounded-3xl bg-[#dae2fd] border border-[#c3c6d7]/30 flex items-center gap-8">
<div className="flex-1">
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-2">Student Officer Roles</h3>
<p className="text-[#434655]">Empower top-performing students by promoting them to Student Officers to help manage groups, verify tasks, and lead their peers.</p>
</div>
<div className="hidden sm:flex w-32 h-32 bg-[#004ac6]/20 rounded-full items-center justify-center">
<span className="material-symbols-outlined text-[#004ac6] text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
</div>
</div>
<div className="p-8 rounded-3xl border border-[#737686]-variant/30">
<span className="material-symbols-outlined text-[#004ac6] mb-4">notifications_active</span>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-2">Smart Alerts</h3>
<p className="text-[#131b2e]-variant text-sm">Automatic nudges for lagging tasks and missed milestones.</p>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-[#faf8ff]" id="roles">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] text-center mb-16">Tailored for Every Role</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-[24px]">
<div className="p-8 bg-white rounded-3xl shadow-sm border border-[#c3c6d7]/20 hover:-translate-y-2 transition-transform">
<div className="w-14 h-14 bg-[#004ac6]/10 text-[#004ac6] rounded-2xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl">supervisor_account</span>
</div>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-4">Teacher</h3>
<ul className="space-y-3 text-[#131b2e]-variant">
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Define project parameters</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Review group compositions</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Assess final contributions</li>
</ul>
</div>
<div className="p-8 bg-white rounded-3xl shadow-sm border border-[#c3c6d7]/20 hover:-translate-y-2 transition-transform">
<div className="w-14 h-14 bg-[#006686]/10 text-[#006686] rounded-2xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl">military_tech</span>
</div>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-4">Student Officer</h3>
<ul className="space-y-3 text-[#131b2e]-variant">
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Manage team meetings</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Oversee Kanban board</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Report group progress</li>
</ul>
</div>
<div className="p-8 bg-white rounded-3xl shadow-sm border border-[#c3c6d7]/20 hover:-translate-y-2 transition-transform">
<div className="w-14 h-14 bg-[#525657]/10 text-[#525657] rounded-2xl flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-3xl">person</span>
</div>
<h3 className="font-['Inter'] font-semibold text-[24px] leading-[32px] mb-4">Student</h3>
<ul className="space-y-3 text-[#131b2e]-variant">
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Log skill assessments</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Receive optimized tasks</li>
<li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check</span> Collaborate in real-time</li>
</ul>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px] bg-white" id="pricing">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<h2 className="font-['Inter'] font-semibold text-3xl md:text-[36px] md:leading-[44px] tracking-[-0.01em] text-center mb-16">Trusted by Educators &amp; Students</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[24px]">
<div className="p-10 rounded-3xl bg-[#faf8ff]-container-low relative">
<span className="material-symbols-outlined text-[#004ac6]/20 text-7xl absolute top-8 left-8">format_quote</span>
<div className="relative z-10">
<p className="font-['Inter'] font-normal text-[18px] leading-[28px] mb-8 italic text-[#131b2e]-variant">
                            "Before this system, group assignments were a grading nightmare. Now, I have clear visibility into who is doing what, and the teams are much more harmonious."
                        </p>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-[#004ac6]/20 flex items-center justify-center"><span className="material-symbols-outlined text-[#004ac6]">school</span></div>
<div>
<p className="font-bold">Dr. Sarah Mitchell</p>
<p className="text-sm text-[#131b2e]-variant">Professor of Computer Science</p>
</div>
</div>
</div>
</div>
<div className="p-10 rounded-3xl bg-[#faf8ff]-container-low relative">
<span className="material-symbols-outlined text-[#004ac6]/20 text-7xl absolute top-8 left-8">format_quote</span>
<div className="relative z-10">
<p className="font-['Inter'] font-normal text-[18px] leading-[28px] mb-8 italic text-[#131b2e]-variant">
                            "I love how the system identified my strengths in UI design and assigned me relevant tasks. It made the project feel like a real professional experience."
                        </p>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-full bg-[#006686]/10 flex items-center justify-center"><span className="material-symbols-outlined text-[#006686]">face</span></div>
<div>
<p className="font-bold">Liam Peterson</p>
<p className="text-sm text-[#131b2e]-variant">3rd Year Student</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-20 md:py-[120px]">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<div className="bg-[#004ac6] rounded-[3rem] p-12 md:p-20 text-center text-[#ffffff] relative overflow-hidden">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
<h2 className="font-['Inter'] font-bold text-4xl md:text-[60px] md:leading-[72px] tracking-[-0.02em] mb-8 relative z-10">Transform the Way Students Work Together</h2>
<p className="text-body-lg font-body-lg mb-12 max-w-2xl mx-auto opacity-90 relative z-10">
                    Join hundreds of classrooms already using smart algorithms to power their collaborative learning environments.
                </p>
<div className="flex flex-wrap justify-center gap-6 relative z-10">
<Link href="/login" className="bg-white text-[#004ac6] px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-transform text-center">
                        Create a Classroom
                    </Link>
</div>
</div>
</div>
</section>

<footer className="w-full py-20 md:py-[120px] bg-[#faf8ff]-container-low border-t border-[#737686]-variant/30">
<div className="max-w-[1200px] mx-auto px-6 md:px-[48px]">
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-[24px] mb-16">
<div className="col-span-2 space-y-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#004ac6] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
<span className="font-['Inter'] font-semibold text-[24px] leading-[32px] font-bold text-[#004ac6]">Trippy Tropa</span>
</div>
<p className="text-[#131b2e]-variant max-w-xs">Empowering education through intelligent collaborative tools and algorithmic efficiency.</p>
</div>
<div className="space-y-4">
<h4 className="font-bold">Product</h4>
<ul className="space-y-2">
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">Features</a></li>
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">How it Works</a></li>
</ul>
</div>
<div className="space-y-4">
<h4 className="font-bold">Company</h4>
<ul className="space-y-2">
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">About Us</a></li>
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">Careers</a></li>
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">Blog</a></li>
</ul>
</div>
<div className="space-y-4">
<h4 className="font-bold">Legal</h4>
<ul className="space-y-2">
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">Privacy Policy</a></li>
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">Terms of Service</a></li>
<li><a className="text-[#131b2e]-variant hover:text-[#004ac6] transition-colors text-label-md" href="#">Cookie Policy</a></li>
</ul>
</div>
<div className="space-y-4">
<h4 className="font-bold">Social</h4>
<div className="flex gap-4">
<a className="w-10 h-10 rounded-full bg-[#faf8ff]-container flex items-center justify-center hover:bg-[#004ac6]/10 transition-colors" href="#">
<img className="w-6 h-6 rounded-sm" data-alt="Social media logo for Twitter or X in a clean minimalist style, white on transparent background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuADRsTVzuBnzRJgKVNnmn75SF7RNNSoLx88z-dPqVcTH-HXfiJ5oRUl_Kv4WleswsAccmJcmxHnGdX8-wUiTFgepISfgSGreKckBpgItqBHWmD01dGeJRmBZkVEA3IlLD34SBRsjaP3iyz49G7bk3CvQsV4MSwA-n9cjxBA-XzapfItOYrmbceQbG1J9fCTt2C95nghU9g4JaWOdZwawWwqV-pZM02eaxB64um5OO0zt-kOK0WtB-s2HJb1xDYBuui31VPp7bgcPnCX"/>
</a>
<a className="w-10 h-10 rounded-full bg-[#faf8ff]-container flex items-center justify-center hover:bg-[#004ac6]/10 transition-colors" href="#">
<img className="w-6 h-6 rounded-sm" data-alt="Social media logo for LinkedIn in a professional minimalist style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB002610L70wTFwJ62JM0oHBSsuA8YFw0fO1H1qJfBzbnsSisQ50ENnwLvpgcn7RraRfouhJBvPJA_idNODBmaNHdTWmZZ1MqINXSIuMDOKgkX0tyN0bjrdbkLa5ZEAMi6t3XHLAQgqPcLS2zGrBuZb1l7a4YWp7ak7bQoAHKur9QrssGmvA7-8X4RTEOalN99tRhbnSOVAcgyn5bOpSer5CL-3AW8ML0Fj8Y5pc0BAa5_deW3JnLvLASoG2ffqovDC82SS1q3TZVm"/>
</a>
</div>
</div>
</div>
<div className="border-t border-[#c3c6d7]/20 pt-8 text-center text-[#131b2e]-variant text-label-md">
                © 2024 Trippy Tropa. All rights reserved.
            </div>
</div>
</footer>
</div>
    </div>
  );
}
