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

//asi como en global plans subjectsManager