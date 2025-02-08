import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"
import Layout from "./components/Layout"
import AuthGuard from "./components/AuthGuard"
import Login from "./pages/Login"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import { supabase } from "./lib/supabase"
import { useAuthStore } from "./lib/store"
import AdminPage from "./pages/AdminPage"
import CourseForm from "./pages/addprojects"
import AdminPageContent from "./pages/AdminPageContent"
import Admin_page from "./pages/admin_page"

function App() {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<div>Home Page</div>} />
          <Route path="projects/:id" element={<div>Project Details</div>} />

          {/* Protected routes */}
          <Route
            path="dashboard"
            element={
              <AuthGuard>
                <div>User Dashboard</div>
              </AuthGuard>
            }
          />
          <Route
            path="cart"
            element={
              <AuthGuard>
                <Cart />
              </AuthGuard>
            }
          />
          <Route
            path="checkout"
            element={
              <AuthGuard>
                <Checkout />
              </AuthGuard>
            }
          />
          <Route
            path="checkout/success"
            element={
              <AuthGuard>
                <CheckoutSuccess />
              </AuthGuard>
            }
          />
          <Route
            path="addprojects"
            element={<CourseForm />}
          />
          <Route
            path="admin"
            element={
              <AuthGuard requireAdmin>
                <AdminPageContent />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
