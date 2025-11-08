import { createSlice } from '@reduxjs/toolkit'

const mobileSlice = createSlice({
  name: 'mobile',
  initialState: {
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
    orientation: 'portrait',
    mobileFeatures: {
      sidebarOpen: false,
      bottomNavigation: true
    }
  },
  reducers: {
    setViewport: (state) => {
      if (typeof window !== 'undefined') {
        state.isMobile = window.innerWidth <= 768
        state.orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      }
    },
    toggleSidebar: (state) => {
      state.mobileFeatures.sidebarOpen = !state.mobileFeatures.sidebarOpen
    },
    setTouchEnabled: (state, action) => {
      state.touchEnabled = action.payload
    }
  }
})

// Asegúrate de exportar toggleSidebar
export const { setViewport, toggleSidebar, setTouchEnabled } = mobileSlice.actions
export default mobileSlice.reducer