import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projectsService } from '$lib/supabase';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    
    // In a real app, this would fetch from Supabase
    // const projects = await projectsService.getAll();
    
    // For demo, return sample data
    const sampleProjects = [
      {
        id: 1,
        name: "Clean Water Initiative",
        description: "Providing clean and safe drinking water to rural communities through well drilling and water purification systems.",
        image_url: "https://images.unsplash.com/photo-1509316785289-025f5b8b4dd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        target_amount: 1000000,
        raised_amount: 654320,
        category: "Health",
        status: 'active',
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
        status: 'active',
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
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        name: "Youth Skills Training",
        description: "Vocational training programs to equip young people with marketable skills for employment and entrepreneurship.",
        image_url: "https://images.unsplash.com/photo-1549920294-7620e61c87fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        target_amount: 500000,
        raised_amount: 187650,
        category: "Employment",
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        name: "Healthcare Outreach",
        description: "Mobile clinics providing medical services, vaccinations, and health education to remote communities.",
        image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        target_amount: 1200000,
        raised_amount: 876540,
        category: "Health",
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 6,
        name: "Reforestation Project",
        description: "Planting trees and educating communities about environmental conservation to combat climate change.",
        image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        target_amount: 850000,
        raised_amount: 321098,
        category: "Environment",
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    let filteredProjects = sampleProjects;
    
    // Apply filters
    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status);
    }
    
    if (category) {
      filteredProjects = filteredProjects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    return json({
      success: true,
      data: filteredProjects,
      total: filteredProjects.length
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
};
