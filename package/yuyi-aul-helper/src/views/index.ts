import { useRoute, useRoute2 } from './useRoute';
import Demo from './Demo'

export const ExaManagerRoute = useRoute(() => import('./ExaManager'))
export const Index = useRoute(() => import('./Test'))
// export const DemoRoute = useRoute(() => import('./Demo'))
export const DemoRoute = useRoute2(Demo)
export const DragUpload = useRoute(() => import('../components/DragUpload'))