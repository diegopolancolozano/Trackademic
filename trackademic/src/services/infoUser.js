
import { supabase } from './supabaseClient';

const infoClient= {};



infoClient.setFaculty=(faculty)=>{
   localStorage['faculty']=faculty;
}

infoClient.setArea=(area)=>{
   localStorage['area']=area;
}

infoClient.setProgram=(program)=>{
   localStorage['program']=program;
}

infoClient.setSemester=(semester)=>{
   localStorage['semester']=semester;
}

//gets

infoClient.getFaculty=()=>{
   return localStorage['faculty'];
}


infoClient.getArea=()=>{
   return localStorage['area'];
}


infoClient.getProgram=()=>{
   return localStorage['program'];
}

infoClient.getSemester=()=>{
   return localStorage['semester'];
}

//getAllInfo

infoClient.init=async (userEmail)=>{
   const { data: userData, error: userError } = await supabase.auth.getUser();
   const userId = userData.user.id;
   
   const { data, error } = await supabase  
   .from('profiles')  
   .select('*')  
   .eq('id', userId)

   
   infoClient.setFaculty(data[0].faculty);
   infoClient.setArea(data[0].area);
   infoClient.setProgram(data[0].program);
   infoClient.setSemester(data[0].semester);

   

}


export const user=infoClient;
