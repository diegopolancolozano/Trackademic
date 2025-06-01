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

// localPlansManager.js
const API_URL = 'https://trackademifunction.vercel.app/api/local_plans';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
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
      
      const plans = await response.json();
      // Normalize IDs in the response
      return plans.map(plan => ({
        ...plan,
        _id: localPlansManager._normalizeId(plan._id)
      }));
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
   * Get a specific plan by ID
   * @param {string} planId - The ID of the plan to fetch
   * @returns {Promise<Object>} - Promise that resolves to the plan object
   */
  getPlanById: async (planId) => {
    try {
      // Normalize the ID before making the request
      const normalizedId = localPlansManager._normalizeId(planId);
      console.log('Fetching plan with normalized ID:', normalizedId); // Debug log
      
      const response = await fetch(`${API_URL}?id=${normalizedId}`, {
        method: 'GET',
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching plan: ${response.statusText}`);
      }
      
      const plans = await response.json();
      console.log('Received plans:', plans); // Debug log
      
      if (!Array.isArray(plans) || plans.length === 0) {
        throw new Error(`Plan not found with ID: ${normalizedId}`);
      }
      
      // Buscar el plan específico con el ID normalizado
      const matchingPlan = plans.find(plan => 
        localPlansManager._normalizeId(plan._id) === normalizedId
      );
      
      if (!matchingPlan) {
        throw new Error(`Plan not found with ID: ${normalizedId}`);
      }
      
      // Normalize the ID in the response
      const normalizedPlan = {
        ...matchingPlan,
        _id: localPlansManager._normalizeId(matchingPlan._id)
      };
      
      console.log('Normalized plan:', normalizedPlan); // Debug log
      return normalizedPlan;
    } catch (error) {
      console.error("Error fetching plan:", error);
      throw error;
    }
  },
  
  /**
   * Helper function to normalize MongoDB ID for comparison
   * @param {string|Object} id - The ID to normalize
   * @returns {string} - The normalized ID string
   */
  _normalizeId: (id) => {
    if (!id) return '';
    
    // Si es una cadena, devolverla directamente
    if (typeof id === 'string') return id;
    
    // Si es un objeto MongoDB con $oid
    if (typeof id === 'object' && id.$oid) {
      return id.$oid;
    }
    
    // Si es un objeto con _id
    if (typeof id === 'object' && id._id) {
      return localPlansManager._normalizeId(id._id);
    }
    
    // Si es un objeto con id
    if (typeof id === 'object' && id.id) {
      return localPlansManager._normalizeId(id.id);
    }
    
    // Convertir a string como último recurso
    return String(id);
  },
  
  /**
   * Update a local plan
   * @param {string} planId - The ID of the plan to update
   * @param {Object} updatedPlan - The updated plan data
   * @returns {Promise<Object>} - Promise that resolves to the updated plan
   */
  updatePlan: async (planId, updatedPlan) => {
    try {
      // Asegurarnos de no enviar el _id en el cuerpo de la petición
      const { _id, ...planToUpdate } = updatedPlan;
      
      console.log('Sending update request:', {
        id: planId,
        plan: planToUpdate
      });

      const response = await fetch(`${API_URL}?id=${planId}`, {
        method: "PUT",
        mode: 'cors',
        headers: defaultHeaders,
        credentials: 'omit',
        body: JSON.stringify(planToUpdate),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating plan: ${errorText}`);
      }
      
      // Como la API no devuelve el documento actualizado, necesitamos obtenerlo
      const updatedPlanResponse = await localPlansManager.getPlanById(planId);
      
      return updatedPlanResponse;
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

      const userPlans = await localPlansManager.getUserPlans(userId);


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
      // First get the current plan to ensure we're updating the correct one
      const currentPlan = await localPlansManager.getPlanById(planId);
      console.log('Current plan:', currentPlan); // Debug log
      
      // Verify we got the correct plan using normalized comparison
      const normalizedCurrentId = localPlansManager._normalizeId(currentPlan._id);
      const normalizedRequestId = localPlansManager._normalizeId(planId);
      
      if (normalizedCurrentId !== normalizedRequestId) {
        console.error('ID mismatch:', { 
          currentId: normalizedCurrentId, 
          requestId: normalizedRequestId 
        });
        throw new Error('Retrieved plan ID does not match requested ID');
      }

      const updatedActivities = currentPlan.activities.map(activity => {
        if (activity.name === activityName) {
          return { 
            ...activity, 
            grade: parseFloat(grade),
            weight: parseFloat(activity.weight)
          };
        }
        return {
          ...activity,
          weight: parseFloat(activity.weight),
          grade: activity.grade !== undefined ? parseFloat(activity.grade) : 0
        };
      });

      const updatedPlan = {
        ...currentPlan,
        activities: updatedActivities,
        updatedAt: new Date()
      };

      console.log('Updating plan with:', updatedPlan); // Debug log

      const result = await localPlansManager.updatePlan(planId, updatedPlan);
      console.log('Update result:', result); // Debug log
      
      // Final verification using normalized comparison
      const normalizedResultId = localPlansManager._normalizeId(result._id);
      
      if (normalizedResultId !== normalizedRequestId) {
        console.error('ID mismatch:', { 
          resultId: normalizedResultId, 
          requestId: normalizedRequestId 
        });
        throw new Error('Update resulted in a different plan ID');
      }

      return result;
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
      const grade = activity.grade !== undefined ? parseFloat(activity.grade) : 0;
      
      if (!isNaN(weight) && !isNaN(grade)) {
        totalWeight += weight;
        weightedSum += weight * grade;
      }
    });
    

    if (totalWeight === 0) {
      return 0;
    }
    

    return weightedSum / totalWeight;
  },

  /**
   * Calculate grades needed in remaining activities to reach a target average
   * @param {Object} plan - The plan object with activities
   * @param {number} targetAverage - The desired average (0-5)
   * @returns {Object} - Object with activity names and required grades
   */
  calculateRequiredGrades(plan, targetAverage) {
    if (!plan.activities || plan.activities.length === 0) {
      return { message: 'No hay actividades para calcular' };
    }

    const remainingActivities = plan.activities.filter(a => a.grade === 0 || a.grade === null);
    const assignedActivities = plan.activities.filter(a => a.grade !== 0 && a.grade !== null);

    if (remainingActivities.length === 0) {
      return { message: 'Todas las actividades están calificadas; no se necesitan más cálculos' };
    }

    // Calcular contribución actual de las actividades ya asignadas
    let currentContribution = 0;
    assignedActivities.forEach(activity => {
      const weight = parseFloat(activity.weight) / 100;
      const grade = parseFloat(activity.grade);
      currentContribution += weight * grade;
    });

    // Calcular cuánto falta para alcanzar el promedio objetivo
    const neededContribution = targetAverage - currentContribution;

    // Si la contribución necesaria es negativa o no se puede alcanzar, ajustar mensaje
    if (neededContribution <= 0) {
      return { message: 'Ya has alcanzado o superado tu promedio objetivo con las notas asignadas.' };
    }

    const requiredGrades = {};
    let remainingNeed = neededContribution;

    // Procesar actividades en orden para asignar notas
    for (const activity of remainingActivities) {
      if (remainingNeed <= 0) break; // Si ya alcanzamos el objetivo, paramos

      const activityWeight = parseFloat(activity.weight) / 100;
      // Calcular la nota necesaria para cubrir lo que falta
      let requiredGrade = remainingNeed / activityWeight;
      // Redondear al mínimo alcanzable (incrementos de 0.1)
      requiredGrade = Math.ceil(requiredGrade * 10) / 10; // Redondear al siguiente 0.1
      requiredGrade = Math.min(Math.max(requiredGrade, 0), 5); // Limitar a 0-5
      const contribution = (requiredGrade * activityWeight).toFixed(2);

      requiredGrades[activity.name] = {
        requiredGrade: requiredGrade.toFixed(2),
        contribution: contribution
      };

      // Actualizar lo que falta
      remainingNeed -= parseFloat(contribution);
    }

    // Si no se puede alcanzar el objetivo con las actividades restantes
    if (remainingNeed > 0) {
      return { message: 'No es posible alcanzar tu promedio objetivo con las actividades restantes.' };
    }

    return requiredGrades;
  }
};

export default localPlansManager;