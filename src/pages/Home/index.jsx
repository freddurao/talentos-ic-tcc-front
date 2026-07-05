/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons'

import Layout from '../../components/Layout'
import JobCard from '../../components/JobCard'

import useAuth from '../../hooks/useAuth'
import { useGetCompanies } from '../../hooks/companies'
import { useGetJobs } from '../../hooks/jobs'

import './styles.css'

function Home() {

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/vagas')
    }
  }, [isAuthenticated, navigate])

  const [page] = useState(1)

  const { jobs } = useGetJobs(page, 8, {
    filter: undefined,
  })

  const { companies } = useGetCompanies()

  return (
    <Layout>
      <div className="home-page">

        <section className="hero">
          <div className="hero-content">

            <div className="hero-tag">
              <FontAwesomeIcon icon={faBriefcase} />
              <span> Plataforma de Oportunidades</span>
            </div>

            <h1>
              Conectando estudantes e empresas em um único lugar.
            </h1>

            <p>
              Encontre oportunidades de estágio, iniciação científica e emprego
              ou publique vagas para encontrar novos talentos.
            </p>

            <div className="hero-buttons">
              <Link className="btn-primary" to="/register">
                Criar Conta
              </Link>

              <Link className="btn-secondary" to="/login">
                Entrar
              </Link>
            </div>

          </div>
        </section>

        <section className="section-home">

          <div className="section-title">

            <h2>
              <FontAwesomeIcon icon={faBriefcase} />
              <span> Vagas em destaque</span>
            </h2>

            <Link to="/vagas">
              Ver todas →
            </Link>

          </div>

          <div className="carousel">

            {jobs &&
              jobs.map(job => (

                <div className="carousel-item" key={job.id}>
                  <JobCard data={job} />
                </div>

              ))}

          </div>

        </section>

        <section className="section-home">

          <div className="section-title">

            <h2>
              <FontAwesomeIcon icon={faBuilding} />
              <span> Empresas parceiras</span>
            </h2>

            <Link to="/empresas">
              Ver todas →
            </Link>

          </div>

          <div className="carousel">

            {companies &&
              companies.slice(0, 8).map(company => (

                <div
                  className="company-card"
                  key={company.id}
                >

                  <div className="company-avatar">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>

                  <h3>{company.name}</h3>

                  <p>
                    {company.segment || 'Empresa Parceira'}
                  </p>

                  <span>
                    {company.description
                      ? company.description.substring(0, 120)
                      : 'Conheça esta empresa parceira da plataforma.'}
                  </span>

                  <Link
                    className="company-button"
                    to="/empresas"
                  >
                    Ver empresa
                  </Link>

                </div>

              ))}

          </div>

        </section>

        <section className="how-it-works">

          <h2>Como funciona</h2>

          <div className="steps">

            <div className="step">
              <div className="number">1</div>
              <h3>Cadastre-se</h3>
              <p>
                Crie gratuitamente seu perfil.
              </p>
            </div>

            <div className="step">
              <div className="number">2</div>
              <h3>Encontre oportunidades</h3>
              <p>
                Navegue pelas vagas disponíveis.
              </p>
            </div>

            <div className="step">
              <div className="number">3</div>
              <h3>Conquiste sua vaga</h3>
              <p>
                Candidate-se diretamente pela plataforma.
              </p>
            </div>

          </div>

        </section>

        <section className="cta">

          <h2>
            Pronto para começar?
          </h2>

          <p>
            Cadastre-se gratuitamente e encontre novas oportunidades.
          </p>

          <Link
            className="btn-primary"
            to="/cadastro"
          >
            Criar Conta
          </Link>

        </section>

      </div>
    </Layout>
  )
}

export default Home