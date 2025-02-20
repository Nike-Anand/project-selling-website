import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import RemoveProjects from "./pages/RemoveProjects"
import ECommerceApp from "./pages/homepage"
import { useEffect } from "react"
import Layout from "./components/Layout"
import AuthGuard from "./components/AuthGuard"
import AuthPage from "./pages/AuthPage"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import CheckoutSuccess from "./pages/CheckoutSuccess"
import { supabase } from "./lib/supabase"
import { useAuthStore } from "./lib/store"
import SignInPage from "./pages/signinpage"
import CourseForm from "./pages/addprojects"
import AdminPageContent from "./pages/AdminPageContent"
import AdminDashboard from "./pages/AdminDashboard"

import Wishlist from "./pages/Wishlist"
import UserPage from "./pages/UserPage"

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

  const { user } = useAuthStore();


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authenticationpage" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<ECommerceApp />} />
          <Route path="products" element={<ECommerceApp />} />

          <Route path="projects/:id" element={<div>Project Details</div>} />

          {/* Protected routes */}
          <Route
            path="RemoveProjects"
            element={<RemoveProjects />}
          />
          <Route
            path="SignInPage"
            element={
              <AuthGuard>
                <SignInPage />
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
            path="wishlist"
            element={
              <AuthGuard>
                <Wishlist />
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
          <Route
            path="admin/dashboard"
            element={
              <AuthGuard requireAdmin>
                <AdminDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="user"
            element={
              <AuthGuard>
                <UserPage />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
