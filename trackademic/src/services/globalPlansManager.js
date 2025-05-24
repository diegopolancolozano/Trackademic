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


const plansManager={}

plansManager.getPlans=async ()=>{
    
}
export default plansManager;
