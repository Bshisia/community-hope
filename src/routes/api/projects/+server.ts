import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { projectsService } from '$lib/database.js';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    
    // Fetch projects from SQLite database
    let projects = projectsService.getAll();
    
    // Apply filters
    if (status) {
      projects = projects.filter(p => p.status === status);
    }
    
    if (category) {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    return json({
      success: true,
      data: projects,
      total: projects.length
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
};
