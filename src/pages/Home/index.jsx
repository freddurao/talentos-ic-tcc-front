import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import useAuth from '../../hooks/useAuth'
import './styles.css'

function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/vagas')
    }
  }, [isAuthenticated, navigate])

  return (
    <Layout>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Conectando Talentos à Computação</h1>
            <p>
              O lugar ideal para encontrar as melhores oportunidades de estágio
              e trabalho no Instituto de Computação.
            </p>
            <div className="cta-buttons">
              <Link to="/login" className="btn-login">
                Entrar
              </Link>
              <Link to="/register" className="btn-register">
                Criar Conta
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Como funciona</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Para Alunos</h3>
              <p>
                Gerencie seu perfil acadêmico, destaque suas habilidades e
                candidate-se às vagas que fazem sentido para sua carreira.
              </p>
            </div>
            <div className="feature-card">
              <h3>Para Empresas</h3>
              <p>
                Publique oportunidades e encontre candidatos com as competências
                técnicas específicas que sua empresa precisa.
              </p>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <p>© 2026 Talentos IC. Conectando o futuro da computação.</p>
        </footer>
      </div>
    </Layout>
  )
}

export default Home
