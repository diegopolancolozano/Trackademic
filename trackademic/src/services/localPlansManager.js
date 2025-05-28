// aqui poner servicios relacionados a los planes locales

// # 1. POST - Crear nuevo plan local (con user_id)
// curl -X POST -H "Content-Type: application/json" \
// -d '{"user_id":"user123", "titulo":"Mi plan personal", "descripcion":"Plan de estudios"}' \
// https://trackademifunction.vercel.app/api/local_plans

// # 2. GET - Obtener todos los planes locales
// curl "https://trackademifunction.vercel.app/api/local_plans"

// # 3. GET - Filtrar planes por user_id (usa el mismo del POST)
// curl "https://trackademifunction.vercel.app/api/local_plans?user_id=user123"

// # 4. PUT - Actualizar plan local completo (cambia el ID)
// curl -X PUT -H "Content-Type: application/json" \
// -d '{"user_id":"user123", "titulo":"Plan actualizado", "descripcion":"Nueva descripción"}' \
// "https://trackademifunction.vercel.app/api/local_plans?id=6831659e3c3688153bc68b67"

// # 5. DELETE - Eliminar plan local
// curl -X DELETE "https://trackademifunction.vercel.app/api/local_plans?id=6831659e3c3688153bc68b67"

const API_URL = 'https://trackademifunction.vercel.app/api/local_plans';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const localPlansManager = {
  /**
   * Get all local plans for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} - Promise that resolves to an array of plans
   */
  getUserPlans: async (userId) => {
    try {
      const response = await fetch(`${API_URL}?user_id=${userId}`, {
        method: 'GET',
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching user plans: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching user plans:", error);
      throw error;
    }
  },
  
  /**
   * Add a new plan to the user's local plans
   * @param {Object} plan - The plan to add
   * @returns {Promise<Object>} - Promise that resolves to the created plan
   */
  addPlan: async (plan) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit',
        body: JSON.stringify(plan),
      });
      
      if (!response.ok) {
        throw new Error(`Error adding plan: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding plan:", error);
      throw error;
    }
  },
  
  /**
   * Update a local plan
   * @param {string} planId - The ID of the plan to update
   * @param {Object} updatedPlan - The updated plan data
   * @returns {Promise<Object>} - Promise that resolves to the updated plan
   */
  updatePlan: async (planId, updatedPlan) => {
    try {
      const response = await fetch(`${API_URL}?id=${planId}`, {
        method: "PUT",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit',
        body: JSON.stringify(updatedPlan),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating plan: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error;
    }
  },
  
  /**
   * Delete a local plan
   * @param {string} planId - The ID of the plan to delete
   * @returns {Promise<Object>} - Promise that resolves to the operation result
   */
  deletePlan: async (planId) => {
    try {
      const response = await fetch(`${API_URL}?id=${planId}`, {
        method: "DELETE",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting plan: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error;
    }
  },
  
  /**
   * Delete all local plans for a user
   * @param {string} userId - The ID of the user
   * @returns {Promise<boolean>} - Promise that resolves to true if successful
   */
  deleteAllUserPlans: async (userId) => {
    try {
      // First get all plans for the user
      const userPlans = await localPlansManager.getUserPlans(userId);
      
      // Delete each plan
      const deletePromises = userPlans.map(plan => 
        localPlansManager.deletePlan(plan._id)
      );
      
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error deleting all user plans:", error);
      throw error;
    }
  },
  
  /**
   * Update a grade in a local plan
   * @param {string} planId - The ID of the plan
   * @param {string} activityName - The name of the activity
   * @param {number} grade - The new grade (0-5)
   * @returns {Promise<Object>} - Promise that resolves to the updated plan
   */
  updateGrade: async (planId, activityName, grade) => {
    try {
      // Get the current plan
      const response = await fetch(`${API_URL}?id=${planId}`, {
        method: 'GET',
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching plan: ${response.statusText}`);
      }
      
      const plans = await response.json();
      if (plans.length === 0) {
        throw new Error(`Plan not found with ID: ${planId}`);
      }
      
      const plan = plans[0];
      
      // Find the activity and update the grade
      const updatedActivities = plan.activities.map(activity => {
        if (activity.name === activityName) {
          return { ...activity, grade: Number(grade) };
        }
        return activity;
      });
      
      // Update the plan with the new activities
      const updatedPlan = { ...plan, activities: updatedActivities };
      
      // Save the updated plan
      return await localPlansManager.updatePlan(planId, updatedPlan);
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  },
  
  /**
   * Calculate the weighted average for a plan
   * @param {Object} plan - The plan object with activities
   * @returns {number} - The weighted average
   */
  calculateAverage: (plan) => {
    if (!plan.activities || plan.activities.length === 0) {
      return 0;
    }
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    plan.activities.forEach(activity => {
      const weight = parseFloat(activity.weight) / 100;
      const grade = parseFloat(activity.grade || 0);
      
      totalWeight += weight;
      weightedSum += weight * grade;
    });
    
    // Normalize if weights don't sum to 1
    if (totalWeight > 0 && totalWeight !== 1) {
      return weightedSum / totalWeight;
    }
    
    return weightedSum;
  }
};

export default localPlansManager;