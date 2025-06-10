<script lang="ts">
  import { onMount } from 'svelte';
  import { Heart, Target, Users, TrendingUp } from 'lucide-svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import DonationModal from '$lib/components/DonationModal.svelte';
  import type { Project } from '$lib/supabase';

  // Sample projects data (in real app, this would come from Supabase)
  let projects: Project[] = [
    {
      id: 1,
      name: "Clean Water Initiative",
      description: "Providing clean and safe drinking water to rural communities through well drilling and water purification systems.",
      image_url: "https://images.unsplash.com/photo-1509316785289-025f5b8b4dd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      target_amount: 1000000,
      raised_amount: 654320,
      category: "Health",
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Education for All",
      description: "Building schools and providing educational materials for children in underserved areas to ensure access to quality education.",
      image_url: "https://images.unsplash.com/photo-1523050854058-8df90120c54f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      target_amount: 2500000,
      raised_amount: 1234567,
      category: "Education",
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Food Relief Program",
      description: "Distributing nutritious meals to families affected by drought and food insecurity across the region.",
      image_url: "https://images.unsplash.com/photo-1514539079131-061a37729f30?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      target_amount: 750000,
      raised_amount: 432100,
      category: "Health",
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  let showDonationModal = false;
  let selectedProject: Project | null = null;

  // Statistics
  $: totalRaised = projects.reduce((sum, project) => sum + project.raised_amount, 0);
  $: totalProjects = projects.length;
  $: totalDonors = 1247; // This would come from database

  function openDonationModal(project: Project) {
    selectedProject = project;
    showDonationModal = true;
  }

  function closeDonationModal() {
    showDonationModal = false;
    selectedProject = null;
  }

  onMount(() => {
    // In real app, load projects from Supabase here
    // projects = await projectsService.getAll();
  });
</script>

<svelte:head>
  <title>Community Hope - Anonymous Donations Platform</title>
  <meta name="description" content="Support meaningful social projects anonymously with M-Pesa integration. Make a difference in your community." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6 fade-in">
        Make a Difference
        <span class="text-secondary-400">Anonymously</span>
      </h1>
      <p class="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto fade-in">
        Support meaningful social projects without revealing your identity.
        Your contribution directly impacts lives and strengthens communities.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in">
        <a href="#projects" class="btn-secondary text-lg px-8 py-3">
          View Projects
        </a>
        <button
          class="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600"
          on:click={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Learn More
        </button>
      </div>
    </div>
  </div>
</section>

<!-- Statistics Section -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-primary-100 rounded-full">
            <Target class="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-2">
          KES {totalRaised.toLocaleString()}
        </h3>
        <p class="text-gray-600">Total Raised</p>
      </div>

      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-secondary-100 rounded-full">
            <Heart class="h-8 w-8 text-secondary-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-2">{totalProjects}</h3>
        <p class="text-gray-600">Active Projects</p>
      </div>

      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-green-100 rounded-full">
            <Users class="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-2">{totalDonors.toLocaleString()}</h3>
        <p class="text-gray-600">Anonymous Donors</p>
      </div>
    </div>
  </div>
</section>

<!-- Projects Section -->
<section id="projects" class="py-16 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Featured Projects
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Support these meaningful initiatives that are making a real difference in communities across Kenya.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each projects as project (project.id)}
        <ProjectCard
          {project}
          on:donate={() => openDonationModal(project)}
        />
      {/each}
    </div>

    <div class="text-center mt-12">
      <button class="btn-primary text-lg px-8 py-3">
        View All Projects
      </button>
    </div>
  </div>
</section>

<!-- How It Works Section -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        How It Works
      </h2>
      <p class="text-xl text-gray-600">
        Making a difference is simple and completely anonymous
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            1
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Choose a Project</h3>
        <p class="text-gray-600">
          Browse through our curated list of social projects and find one that resonates with your values.
        </p>
      </div>

      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            2
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Make Your Donation</h3>
        <p class="text-gray-600">
          Donate securely using M-Pesa or card payment. No personal information is stored or shared.
        </p>
      </div>

      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            3
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Make an Impact</h3>
        <p class="text-gray-600">
          Your contribution goes directly to the project, creating real change in communities.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Donation Modal -->
{#if showDonationModal && selectedProject}
  <DonationModal
    project={selectedProject}
    on:close={closeDonationModal}
  />
{/if}
