import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout'
import Query from '@/pages/Query'
import Patient from '@/pages/patientManagement/Patient'
import Welcome from '@/pages/welcome/Welcome'
import Registration from '@/pages/registrationManagement/Registration'
import RegistrationDelete from '@/pages/registrationManagement/RegistrationDelete'
import MedicalAdvice from '@/pages/medicalAdviceManagement/MedicalAdvice'
import CanLeave from '@/pages/medicalAdviceManagement/CanLeave'
import CanLeaveQuery from '@/pages/medicalAdviceManagement/CanLeaveQuery'
import MedicalAdviceQuery from '@/pages/medicalAdviceManagement/MedicalAdviceQuery'
import AdviceReview from '@/pages/medicalAdviceHandleManagement/AdviceReview'
import AdviceExecute from '@/pages/medicalAdviceHandleManagement/AdviceExecute'
import Ward from '@/pages/wardManagement/Ward'
import WardEdit from '@/pages/wardManagement/WardEdit'
import WardType from '@/pages/wardManagement/WardType'
import Bed from '@/pages/bedManagement/Bed'
import BedReturn from '@/pages/bedManagement/BedReturn'
import BedEdit from '@/pages/bedManagement/BedEdit'
import BedSelect from '@/pages/bedManagement/BedSelect'
import BedChange from '@/pages/bedManagement/BedChange'
import PatientUpdate from '@/pages/patientManagement/PatientUpdate'
import Staff from '@/pages/staffManagement/Staff'
import StaffQuit from '@/pages/staffManagement/StaffQuit'
import Dept from '@/pages/deptManagement/Dept'
import DeptEdit from '@/pages/deptManagement/DeptEdit'
import Drug from '@/pages/drugsManagement/Drug'
import DrugOffer from '@/pages/drugsManagement/DrugOffer'
import DrugApply from '@/pages/drugsManagement/DrugApply'
import DrugApplyCancel from '@/pages/drugsManagement/DrugApplyCancel'
import DrugReturn from '@/pages/drugsManagement/DrugReturn'
import DrugRecord from '@/pages/drugsManagement/DrugRecord'
import Equipment from '@/pages/equipmentManagement/Equipment'
import EquipmentAdd from '@/pages/equipmentManagement/EquipmentAdd'
import Record from '@/pages/recordManagement/Record'
import RecordAdd from '@/pages/recordManagement/RecordAdd'
import RecordUpdate from '@/pages/recordManagement/RecordUpdate'
import DepositQuery from '@/pages/costManagement/DepositQuery'
import DepositAdd from '@/pages/costManagement/DepositAdd'
import DepositReturn from '@/pages/costManagement/DepositReturn'
import RefundQuery from '@/pages/costManagement/RefundQuery'
import CostQuery from '@/pages/costManagement/CostQuery'
import CostAdd from '@/pages/costManagement/CostAdd'
import Bill from '@/pages/costManagement/Bill'
import Leave from '@/pages/leaveManagement/Leave'
import LeaveQuery from '@/pages/leaveManagement/LeaveQuery'
import LeaveEdit from '@/pages/leaveManagement/LeaveEdit'
import PatientMedicalRecordQuery from '@/pages/queryManagement/PatientMedicalRecordQuery'
import PatientCostQuery from '@/pages/queryManagement/PatientCostQuery'
import PatientDepositQuery from '@/pages/queryManagement/PatientDepositQuery'
import PatientInpatientQuery from '@/pages/queryManagement/PatientInpatientQuery'
import CostItemEdit from '@/pages/sys/CostItemEdit'
import SysLog from '@/pages/sys/SysLog'
import Permission from '@/pages/sys/Permission'
import MenuEdit from '@/pages/sys/MenuEdit'

import Login from '@/pages/login/Login'
import Analysis from '@/pages/Analysis'
import Analysis2 from '@/pages/Analysis2'


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
      meta:{
        requireAuth: true
      },
      children: [
        {
          path: 'patient',
          name: 'Patient',
          component: Patient,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'patientUpdate',
          name: 'PatientUpdate',
          component: PatientUpdate,
          meta:{
            requireAuth: true
          }
        },
        {
          path: '/admin',
          name: 'Welcome',
          component: Welcome,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'registration',
          name: 'Registration',
          component: Registration,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'registrationDelete',
          name: 'RegistrationDelete',
          component: RegistrationDelete,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'medicalAdviceQuery',
          name: 'MedicalAdviceQuery',
          component: MedicalAdviceQuery,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'adviceReview',
          name: 'AdviceReview',
          component: AdviceReview,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'adviceExecute',
          name: 'AdviceExecute',
          component: AdviceExecute,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'medicalAdvice',
          name: 'MedicalAdvice',
          component: MedicalAdvice,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'canLeave',
          name: 'CanLeave',
          component: CanLeave,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'canLeaveQuery',
          name: 'CanLeaveQuery',
          component: CanLeaveQuery,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'ward',
          name: 'Ward',
          component: Ward,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'wardEdit',
          name: 'WardEdit',
          component: WardEdit,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'wardType',
          name: 'WardType',
          component: WardType,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'bed',
          name: 'Bed',
          component: Bed,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'bedReturn',
          name: 'BedReturn',
          component: BedReturn,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'bedEdit',
          name: 'BedEdit',
          component: BedEdit,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'bedSelect',
          name: 'BedSelect',
          component: BedSelect,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'bedChange',
          name: 'BedChange',
          component: BedChange,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'analysis',
          name: 'Analysis',
          component: Analysis,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'analysis2',
          name: 'Analysis2',
          component: Analysis2,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'staff',
          name: 'Staff',
          component: Staff,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'staffQuit',
          name: 'StaffQuit',
          component: StaffQuit,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'dept',
          name: 'Dept',
          component: Dept,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'deptEdit',
          name: 'DeptEdit',
          component: DeptEdit,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'drug',
          name: 'Drug',
          component: Drug,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'drugOffer',
          name: 'DrugOffer',
          component: DrugOffer,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'drugApply',
          name: 'DrugApply',
          component: DrugApply,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'drugApplyCancel',
          name: 'DrugApplyCancel',
          component: DrugApplyCancel,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'drugReturn',
          name: 'DrugReturn',
          component: DrugReturn,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'drugRecord',
          name: 'DrugRecord',
          component: DrugRecord,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'record',
          name: 'Record',
          component: Record,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'recordAdd',
          name: 'RecordAdd',
          component: RecordAdd,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'recordUpdate',
          name: 'RecordUpdate',
          component: RecordUpdate,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'equipment',
          name: 'Equipment',
          component: Equipment,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'equipmentAdd',
          name: 'EquipmentAdd',
          component: EquipmentAdd,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'leave',
          name: 'Leave',
          component: Leave,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'leaveQuery',
          name: 'LeaveQuery',
          component: LeaveQuery,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'leaveEdit',
          name: 'LeaveEdit',
          component: LeaveEdit,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'depositQuery',
          name: 'DepositQuery',
          component: DepositQuery,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'depositAdd',
          name: 'DepositAdd',
          component: DepositAdd,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'costQuery',
          name: 'CostQuery',
          component: CostQuery,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'costAdd',
          name: 'CostAdd',
          component: CostAdd,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'bill',
          name: 'Bill',
          component: Bill,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'depositReturn',
          name: 'DepositReturn',
          component: DepositReturn,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'refundQuery',
          name: 'RefundQuery',
          component: RefundQuery,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'costItemEdit',
          name: 'CostItemEdit',
          component: CostItemEdit,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'sysLog',
          name: 'SysLog',
          component: SysLog,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'permission',
          name: 'Permission',
          component: Permission,
          meta:{
            requireAuth: true
          }
        },
        {
          path: 'menuEdit',
          name: 'MenuEdit',
          component: MenuEdit,
          meta:{
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/patient/query',
      name: 'Query',
      component: Query,
      children:[
        {
          path: 'patientCostQuery',
          name: 'PatientCostQuery',
          component: PatientCostQuery
        },
        {
          path: 'patientMedicalRecordQuery',
          name: 'PatientMedicalRecordQuery',
          component: PatientMedicalRecordQuery
        },
        {
          path: 'patientDepositQuery',
          name: 'PatientDepositQuery',
          component: PatientDepositQuery
        },
        {
          path: '/patient/query',
          name: 'PatientInpatientQuery',
          component: PatientInpatientQuery
        }
      ]
    }
  ],
  mode:'history'
})

