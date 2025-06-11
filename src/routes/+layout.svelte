<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { Heart, Menu, X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  
  let mobileMenuOpen = false;

  const dispatch = createEventDispatcher();

  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function handleDonate() {
    dispatch('donate', project);
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white shadow-lg sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2" on:click={closeMobileMenu}>
            <Heart class="h-8 w-8 text-primary-600" />
            <span class="text-xl font-bold text-gray-900">Community Hope</span>
          </a>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a 
              href="/" 
              class="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              class:text-primary-600={$page.url.pathname === '/'}
            >
              Home
            </a>
            <a 
              href="/#projects" 
              class="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Projects
            </a>
            <a 
              href="/admin" 
              class="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              class:text-primary-600={$page.url.pathname === '/admin'}
            >
              Admin
            </a>
            <button 
              class="btn-primary flex-1"
              on:click={handleDonate}
            >
              Donate Now
            </button>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            type="button"
            class="text-gray-900 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            on:click={toggleMobileMenu}
          >
            {#if mobileMenuOpen}
              <X class="h-6 w-6" />
            {:else}
              <Menu class="h-6 w-6" />
            {/if}
          </button>
        </div>
      </div>
      
      <!-- Mobile Navigation -->
      {#if mobileMenuOpen}
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a 
              href="/" 
              class="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              class:text-primary-600={$page.url.pathname === '/'}
              on:click={closeMobileMenu}
            >
              Home
            </a>
            <a 
              href="/#projects" 
              class="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              on:click={closeMobileMenu}
            >
              Projects
            </a>
            <a 
              href="/admin" 
              class="text-gray-900 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              class:text-primary-600={$page.url.pathname === '/admin'}
              on:click={closeMobileMenu}
            >
              Admin
            </a>
            <a 
              href="/#donate" 
              class="btn-secondary block text-center mt-4"
              on:click={closeMobileMenu}
            >
              Donate Now
            </a>
          </div>
        </div>
      {/if}
    </div>
  </nav>
  
  <!-- Main Content -->
  <main>
    <slot />
  </main>
  
  <!-- Footer -->
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <Heart class="h-8 w-8 text-primary-400" />
            <span class="text-xl font-bold">Community Hope</span>
          </div>
          <p class="text-gray-300 mb-4">
            Empowering communities through anonymous donations. 
            Support meaningful social projects and make a difference without revealing your identity.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Facebook</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-300 hover:text-white transition-colors">
              <span class="sr-only">Twitter</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Quick Links</h3>
          <ul class="space-y-2">
            <li><a href="/" class="text-gray-300 hover:text-white transition-colors">Home</a></li>
            <li><a href="/#projects" class="text-gray-300 hover:text-white transition-colors">Projects</a></li>
            <li><a href="/admin" class="text-gray-300 hover:text-white transition-colors">Admin</a></li>
            <li><a href="/#about" class="text-gray-300 hover:text-white transition-colors">About</a></li>
          </ul>
        </div>
        
        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Support</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-700">
        <p class="text-center text-gray-400">
          © 2024 Community Hope. All rights reserved. Built with ❤️ for the community.
        </p>
      </div>
    </div>
  </footer>
</div>
