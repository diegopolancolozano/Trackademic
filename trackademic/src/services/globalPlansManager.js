// API endpoints for global plans
const API_URL = 'https://trackademifunction.vercel.app/api/global_plans';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const plansManager = {};

// Get all plans or filter by subject_id
plansManager.getPlans = async (subject_id = null) => {
    try {
        const url = subject_id ? `${API_URL}?subject_id=${subject_id}` : API_URL;
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: defaultHeaders,
            credentials: 'omit'
        });
        if (!response.ok) {
            throw new Error('Error fetching plans');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in getPlans:', error);
        throw error;
    }
};

// Create a new plan
plansManager.createPlan = async (planData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: defaultHeaders,
            credentials: 'omit',
            body: JSON.stringify(planData),
        });
        if (!response.ok) {
            throw new Error('Error creating plan');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in createPlan:', error);
        throw error;
    }
};

// Update a plan
plansManager.updatePlan = async (id, updateData) => {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: defaultHeaders,
            credentials: 'omit',
            body: JSON.stringify(updateData),
        });
        if (!response.ok) {
            throw new Error('Error updating plan');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in updatePlan:', error);
        throw error;
    }
};

// Delete a plan
plansManager.deletePlan = async (id) => {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: defaultHeaders,
            credentials: 'omit'
        });
        if (!response.ok) {
            throw new Error('Error deleting plan');
        }
        return await response.json();
    } catch (error) {
        console.error('Error in deletePlan:', error);
        throw error;
    }
};

export default plansManager;
