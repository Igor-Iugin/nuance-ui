import { $modals } from '@nui/modals'

import HistorySidebar from './history-sidebar.vue'


export const openHistoryBox = $modals.create('map-history', HistorySidebar)
