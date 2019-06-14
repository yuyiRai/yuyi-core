import * as React from 'react'
import { useRoute } from './useRoute';

export const ExaManagerRoute = useRoute(() => import('./ExaManager'))
export const Index = useRoute(() => import('./Test'))
export const DragUpload = useRoute(() => import('../components/DragUpload'))