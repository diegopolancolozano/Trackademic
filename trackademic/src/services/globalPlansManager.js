import mongo from './mongoClient'

//USAR ESTO https://trackademifunction.vercel.app/api/global_plans

// # POST con formato JSON válido
// curl -X POST -H "Content-Type: application/json" -d '{"subject_id":"math_001", "titulo":"Algebra"}' https://trackademifunction.vercel.app/api/global_plans

// # GET (Todos)
// curl https://trackademifunction.vercel.app/api/global_plans

// # GET (Filtrado)
// curl "https://trackademifunction.vercel.app/api/global_plans?subject_id=math_001"

// # PUT (Actualizar)
// curl -X PUT \
//   -H "Content-Type: application/json" \
//   -d '{"titulo":"Algebra Avanzada"}' \
//   "https://trackademifunction.vercel.app/api/global_plans?id=68316198b3dd23ed0450bca0"

// # DELETE (Eliminar)
// curl -X DELETE "https://trackademifunction.vercel.app/api/global_plans?id=68316198b3dd23ed0450bca0"

const API_URL = 'https://trackademifunction.vercel.app/api/global_plans';

const plansManager = {};

// Get all plans or filter by subject_id
plansManager.getPlans = async (subject_id = null) => {
    try {
        const url = subject_id ? `${API_URL}?subject_id=${subject_id}` : API_URL;
        const response = await fetch(url);
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
            headers: {
                'Content-Type': 'application/json',
            },
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
            headers: {
                'Content-Type': 'application/json',
            },
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
