import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { ProfileCard } from '../components/dashboard/ProfileCard'
import { MenuNavigation } from '../components/dashboard/MenuNavigation'
import { ROUTES } from '../constants'
import '../styles/pages/DashboardPage.css'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header__content">
          <h1>Bienvenido, {user?.nombre}</h1>
          <span className={`role-badge role-badge--${user?.rol?.toLowerCase().replace('role_', '')}`}>
            {user?.rol?.replace('ROLE_', '')}
          </span>
        </div>
        <Button 
          variant="danger" 
          onClick={handleLogout}
          className="btn-logout"
        >
          Cerrar Sesión
        </Button>
      </div>

      <div className="dashboard-content">
        <ProfileCard user={user} />
        <MenuNavigation user={user} onNavigate={navigate} />
      </div>
    </div>
  )
}
