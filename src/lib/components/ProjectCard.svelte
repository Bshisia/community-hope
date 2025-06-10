<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Heart, Target, Calendar } from 'lucide-svelte';
  import type { Project } from '$lib/supabase';
  
  export let project: Project;
  
  const dispatch = createEventDispatcher();
  
  $: progress = (project.raised_amount / project.target_amount) * 100;
  $: progressCapped = Math.min(progress, 100);
  
  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function handleDonate() {
    dispatch('donate', project);
  }
</script>

<div class="card overflow-hidden group">
  <!-- Project Image -->
  <div class="relative h-48 overflow-hidden">
    <img 
      src={project.image_url} 
      alt={project.name}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div class="absolute top-4 left-4">
      <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
        {project.category}
      </span>
    </div>
    <div class="absolute top-4 right-4">
      <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
        <Heart class="h-5 w-5 text-gray-600" />
      </div>
    </div>
  </div>
  
  <!-- Project Content -->
  <div class="p-6">
    <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
      {project.name}
    </h3>
    
    <p class="text-gray-600 mb-4 line-clamp-3">
      {project.description}
    </p>
    
    <!-- Progress Section -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-700">Progress</span>
        <span class="text-sm font-medium text-primary-600">
          {progressCapped.toFixed(1)}%
        </span>
      </div>
      
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          style="width: {progressCapped}%"
        ></div>
      </div>
      
      <div class="flex justify-between items-center mt-2 text-sm text-gray-600">
        <span>Raised: {formatAmount(project.raised_amount)}</span>
        <span>Goal: {formatAmount(project.target_amount)}</span>
      </div>
    </div>
    
    <!-- Project Meta -->
    <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
      <div class="flex items-center space-x-1">
        <Calendar class="h-4 w-4" />
        <span>Created {formatDate(project.created_at)}</span>
      </div>
      <div class="flex items-center space-x-1">
        <Target class="h-4 w-4" />
        <span class="capitalize">{project.status}</span>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button 
        class="btn-primary flex-1"
        on:click={handleDonate}
      >
        Donate Now
      </button>
      <button class="btn-outline px-4">
        Learn More
      </button>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
