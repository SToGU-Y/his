import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout'
import Patient from '@/pages/patientManagement/Patient'
import Welcome from '@/pages/welcome/Welcome'
import Registration from '@/pages/registrationManagement/Registration'
import MedicalAdvice from '@/pages/medicalAdviceManagement/MedicalAdvice'
import MedicalAdviceQuery from '@/pages/medicalAdviceManagement/MedicalAdviceQuery'
import MedicalAdviceDetail from '@/pages/medicalAdviceManagement/MedicalAdviceDetail'
import MedicalAdviceAdd from '@/pages/medicalAdviceManagement/MedicalAdviceAdd'
import Ward from '@/pages/wardManagement/Ward'
import WardType from '@/pages/wardManagement/WardType'
import Bed from '@/pages/bedManagement/Bed'
import BedSelect from '@/pages/bedManagement/BedSelect'


import Login from '@/pages/login/Login'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: 'patient',
          name: 'Patient',
          component: Patient
        },
        {
          path: '/admin',
          name: 'Welcome',
          component: Welcome
        },
        {
          path: 'registration',
          name: 'Registration',
          component: Registration
        },
        {
          path: 'medicalAdviceQuery',
          name: 'MedicalAdviceQuery',
          component: MedicalAdviceQuery
        },
        {
          path: 'medicalAdviceDetail',
          name: 'MedicalAdviceDetail',
          component: MedicalAdviceDetail
        },
        {
          path: 'medicalAdviceAdd',
          name: 'MedicalAdviceAdd',
          component: MedicalAdviceAdd
        },
        {
          path: 'medicalAdvice',
          name: 'MedicalAdvice',
          component: MedicalAdvice
        },
        {
          path: 'ward',
          name: 'Ward',
          component: Ward
        },
        {
          path: 'wardType',
          name: 'WardType',
          component: WardType
        },
        {
          path: 'bed',
          name: 'Bed',
          component: Bed
        },
        {
          path: 'bedSelect',
          name: 'BedSelect',
          component: BedSelect
        }
      ]
    }
  ],
  mode: 'history'
})
