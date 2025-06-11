<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    DollarSign, 
    Calendar,
    Eye,
    LogOut
  } from 'lucide-svelte';
  import { adminService, donationsService } from '$lib/database-services.js';
  import { projectsService } from '$lib/database.js';
  import type { Project, Donation } from '$lib/database.js';
  
  // Authentication state
  let isAuthenticated = false;
  let email = '';
  let password = '';
  let loginError = '';
  let isLoggingIn = false;
  
  // Dashboard data
  let projects: Project[] = [];
  let donations: any[] = [];
  let stats = {
    total: 0,
    count: 0,
    average: 0,
    thisMonth: 0
  };
  
  // Sample data for demo
  const sampleProjects: Project[] = [
    {
      id: 1,
      name: "Clean Water Initiative",
      description: "Providing clean and safe drinking water to rural communities",
      image_url: "",
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
      description: "Building schools and providing educational materials",
      image_url: "",
      target_amount: 2500000,
      raised_amount: 1234567,
      category: "Education",
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  const sampleDonations = [
    { id: 1, project_id: 1, amount: 5000, payment_method: 'mpesa', status: 'completed', created_at: '2024-01-15', projects: { name: 'Clean Water Initiative' } },
    { id: 2, project_id: 2, amount: 10000, payment_method: 'mpesa', status: 'completed', created_at: '2024-01-14', projects: { name: 'Education for All' } },
    { id: 3, project_id: 1, amount: 2500, payment_method: 'card', status: 'completed', created_at: '2024-01-13', projects: { name: 'Clean Water Initiative' } },
    { id: 4, project_id: 2, amount: 7500, payment_method: 'mpesa', status: 'completed', created_at: '2024-01-12', projects: { name: 'Education for All' } },
    { id: 5, project_id: 1, amount: 3000, payment_method: 'mpesa', status: 'completed', created_at: '2024-01-11', projects: { name: 'Clean Water Initiative' } }
  ];
  
  async function handleLogin() {
    if (!email || !password) {
      loginError = 'Please enter both email and password';
      return;
    }
    
    isLoggingIn = true;
    loginError = '';
    
    try {
      const authenticated = await adminService.authenticate(email, password);
      if (authenticated) {
        isAuthenticated = true;
        await loadDashboardData();
      } else {
        loginError = 'Invalid credentials';
      }
    } catch (error) {
      loginError = 'Login failed. Please try again.';
    } finally {
      isLoggingIn = false;
    }
  }
  
  function handleLogout() {
    isAuthenticated = false;
    email = '';
    password = '';
  }
  
  async function loadDashboardData() {
    try {
      // In real app, load from Supabase
      // projects = await projectsService.getAll();
      // donations = await donationsService.getAll();
      // stats = await donationsService.getStats();
      
      // For demo, use sample data
      projects = sampleProjects;
      donations = sampleDonations;
      stats = {
        total: sampleDonations.reduce((sum, d) => sum + d.amount, 0),
        count: sampleDonations.length,
        average: sampleDonations.reduce((sum, d) => sum + d.amount, 0) / sampleDonations.length,
        thisMonth: sampleDonations.reduce((sum, d) => sum + d.amount, 0)
      };
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }
  
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
  
  onMount(() => {
    // Check if already authenticated (in real app, check session)
  });
</script>

<svelte:head>
  <title>Admin Dashboard - Community Hope</title>
</svelte:head>

{#if !isAuthenticated}
  <!-- Login Form -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Access the administrative dashboard
        </p>
      </div>
      <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
        <div class="space-y-4">
          <div>
            <label for="email" class="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="form-input"
              placeholder="admin@communityhope.com"
              bind:value={email}
            />
          </div>
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="form-input"
              placeholder="Enter your password"
              bind:value={password}
            />
          </div>
        </div>
        
        {#if loginError}
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-red-600 text-sm">{loginError}</p>
          </div>
        {/if}
        
        <div>
          <button
            type="submit"
            class="btn-primary w-full flex items-center justify-center"
            class:opacity-50={isLoggingIn}
            disabled={isLoggingIn}
          >
            {#if isLoggingIn}
              <div class="spinner mr-2"></div>
              Signing in...
            {:else}
              Sign in
            {/if}
          </button>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Demo credentials: admin@communityhope.com / password123
          </p>
        </div>
      </form>
    </div>
  </div>
{:else}
  <!-- Dashboard -->
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            on:click={handleLogout}
          >
            <LogOut class="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <DollarSign class="h-6 w-6 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Donations</p>
              <p class="text-2xl font-semibold text-gray-900">{formatAmount(stats.total)}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <BarChart3 class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Projects</p>
              <p class="text-2xl font-semibold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <TrendingUp class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">This Month</p>
              <p class="text-2xl font-semibold text-gray-900">{formatAmount(stats.thisMonth)}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <Users class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Avg. Donation</p>
              <p class="text-2xl font-semibold text-gray-900">{formatAmount(stats.average)}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Donations -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent Donations</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each donations as donation}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {donation.projects?.name || 'Unknown Project'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(donation.amount)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          class:bg-green-100={donation.payment_method === 'mpesa'}
                          class:text-green-800={donation.payment_method === 'mpesa'}
                          class:bg-blue-100={donation.payment_method === 'card'}
                          class:text-blue-800={donation.payment_method === 'card'}>
                      {donation.payment_method === 'mpesa' ? 'M-Pesa' : 'Card'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(donation.created_at)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          class:bg-green-100={donation.status === 'completed'}
                          class:text-green-800={donation.status === 'completed'}
                          class:bg-yellow-100={donation.status === 'pending'}
                          class:text-yellow-800={donation.status === 'pending'}
                          class:bg-red-100={donation.status === 'failed'}
                          class:text-red-800={donation.status === 'failed'}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Projects Summary -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Projects Summary</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Raised
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each projects as project}
                {@const progress = (project.raised_amount / project.target_amount) * 100}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(project.target_amount)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatAmount(project.raised_amount)}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="bg-primary-600 h-2 rounded-full"
                          style="width: {Math.min(progress, 100)}%"
                        ></div>
                      </div>
                      <span class="text-xs">{progress.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          class:bg-green-100={project.status === 'active'}
                          class:text-green-800={project.status === 'active'}
                          class:bg-gray-100={project.status === 'paused'}
                          class:text-gray-800={project.status === 'paused'}
                          class:bg-blue-100={project.status === 'completed'}
                          class:text-blue-800={project.status === 'completed'}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
{/if}
