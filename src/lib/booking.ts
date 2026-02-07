export interface Booking {
    id: string
    clientId: string
    clientName: string
    providerId: string // For MVP, we might hardcode or use active context
    providerName: string
    service: string
    date: string
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
    total: number
    addons: string[]
    timestamp: string
}

// Helper to get bookings from LocalStorage
export const getBookings = (): Booking[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('ranthru_bookings')
    return stored ? JSON.parse(stored) : []
}

// Helper to save bookings
const saveBookings = (bookings: Booking[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('ranthru_bookings', JSON.stringify(bookings))
}

export const createBooking = (bookingData: Omit<Booking, 'id' | 'timestamp' | 'status'>) => {
    const bookings = getBookings()
    const newBooking: Booking = {
        ...bookingData,
        id: `bk_${Date.now().toString(36)}`, // simple id
        timestamp: new Date().toISOString(),
        status: 'pending'
    }
    saveBookings([...bookings, newBooking])
    return newBooking
}

export const updateBookingStatus = (id: string, status: Booking['status']) => {
    const bookings = getBookings()
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
    saveBookings(updated)
    return updated.find(b => b.id === id)
}

export const getProviderBookings = () => { // Removed unused providerId
    const bookings = getBookings()
    // For MVP demo, if provider is 'provider', show them bookings meant for 'Mistress K' or untargeted ones
    // But let's try to be precise if we can. 
    return bookings // Returning all for now to ensure visibility in testing
}
