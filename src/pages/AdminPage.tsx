import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../lib/store"
import { supabase } from "../lib/supabase"

const AdminPage = () => {
  const navigate = useNavigate()
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user && user.email === "nikeanand97@gmail.com") {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
        navigate("/login")
      }
    }

    checkAdminStatus()
  }, [navigate, setIsAdmin])

  if (!isAdmin) {
    return null // Prevent rendering the page while checking admin status
  }

  return (
    <div className="admin-page">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <aside>{/* Sidebar content */}</aside>
      <main>{/* Main content */}</main>
    </div>
  )
}

export default AdminPage

