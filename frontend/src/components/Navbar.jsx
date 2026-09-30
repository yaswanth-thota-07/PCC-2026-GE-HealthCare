import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Menu, X, Building2, FileText, Activity, UploadCloud, Shield, LogIn, HelpCircle } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  currentView,
  onGoHome,
  onBackToPolicy,
  onResetPolicy,
  activePolicy,
  onGoToHospitals,
  onGoToJourney,
  onOpenAuth,
  onOpenProfile,
  onOpenHowItWorks
}) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (action) => {
    closeMobileMenu();
    if (action) action();
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-inner">
        <div className="brand" onClick={() => handleNavClick(onGoHome)} style={{ cursor: 'pointer' }}>
          <img
            src="/sehatsure-logo.png"
            alt="SehatSure Logo"
            className="brand-logo-img"
          />
          <div className="brand-text">
            <span className="brand-name">{t('common.appName')}</span>
            <span className="brand-sub">{t('common.appTagline')}</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links desktop-nav">
          <LanguageSelector compact />

          <button
            type="button"
            onClick={onGoHome}
            className={`nav-link-btn ${currentView === 'upload' ? 'active' : ''}`}
          >
            {t('navbar.uploadPolicy')}
          </button>

          {activePolicy && (
            <button
              type="button"
              onClick={onBackToPolicy}
              className={`nav-link-btn ${currentView === 'summary' ? 'active' : ''}`}
            >
              {t('navbar.policySummary')}
            </button>
          )}

          {activePolicy && activePolicy.confirmedByUser && (
            <>
              <button
                type="button"
                onClick={onGoToHospitals}
                className={`nav-link-btn ${currentView === 'discovery' ? 'active' : ''}`}
              >
                {t('navbar.hospitals')}
              </button>
              <button
                type="button"
                onClick={onGoToJourney}
                className={`nav-link-btn ${currentView === 'journey' ? 'active' : ''}`}
              >
                {t('navbar.careJourney')}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onOpenHowItWorks}
            className={`pill-btn ${currentView === 'how-it-works' ? 'pill-btn-primary' : 'pill-btn-ghost'} nav-cta`}
            title="Hospital Dataset, Costing & AI Methodology Reference"
          >
            <HelpCircle size={15} style={{ marginRight: '6px' }} />
            {t('navbar.howItWorks')}
          </button>

          {/* Profile / Auth Button */}
          {user ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="nav-link-btn nav-profile-btn"
              title={`View Profile: ${user.name} (${user.email})`}
            >
              <div className="nav-avatar">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="nav-username">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="pill-btn pill-btn-ghost nav-cta"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              title="Sign in or create account"
            >
              <UserIcon size={14} />
              <span>Log In</span>
            </button>
          )}
        </div>

        {/* Mobile Navigation Header Actions */}
        <div className="mobile-header-actions">
          <LanguageSelector compact />

          {user ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="mobile-avatar-btn"
              title="View Profile"
              aria-label="View Profile"
            >
              <div className="nav-avatar nav-avatar-sm">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="mobile-auth-icon-btn"
              title="Log In"
              aria-label="Log In"
            >
              <UserIcon size={16} />
            </button>
          )}

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown Sheet */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <div className="mobile-nav-links">
            <button
              type="button"
              onClick={() => handleNavClick(onGoHome)}
              className={`mobile-nav-item ${currentView === 'upload' ? 'active' : ''}`}
            >
              <UploadCloud size={18} />
              <span>{t('navbar.uploadPolicy')}</span>
            </button>

            {activePolicy && (
              <button
                type="button"
                onClick={() => handleNavClick(onBackToPolicy)}
                className={`mobile-nav-item ${currentView === 'summary' ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>{t('navbar.policySummary')}</span>
              </button>
            )}

            {activePolicy && activePolicy.confirmedByUser && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick(onGoToHospitals)}
                  className={`mobile-nav-item ${currentView === 'discovery' ? 'active' : ''}`}
                >
                  <Building2 size={18} />
                  <span>{t('navbar.hospitals')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick(onGoToJourney)}
                  className={`mobile-nav-item ${currentView === 'journey' ? 'active' : ''}`}
                >
                  <Activity size={18} />
                  <span>{t('navbar.careJourney')}</span>
                </button>
              </>
            )}

            <div className="mobile-nav-divider" />

            <button
              type="button"
              onClick={() => handleNavClick(onOpenHowItWorks)}
              className={`pill-btn ${currentView === 'how-it-works' ? 'pill-btn-primary' : 'pill-btn-ghost'} pill-btn-block`}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <HelpCircle size={16} />
              <span>{t('navbar.howItWorks')}</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenProfile)}
                className="mobile-nav-user-card"
              >
                <div className="nav-avatar">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="mobile-user-details">
                  <span className="mobile-user-name">{user.name}</span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick(onOpenAuth)}
                className="pill-btn pill-btn-ghost pill-btn-block"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <LogIn size={16} />
                <span>Log In / Sign Up</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

