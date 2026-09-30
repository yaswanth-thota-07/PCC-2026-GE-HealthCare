import React, { useState } from 'react';
import {
  ExternalLink,
  Database,
  Calculator,
  Server,
  Copy,
  Check,
  Eye,
  CheckCircle2,
  Stethoscope,
  Info
} from 'lucide-react';

export default function HowItWorksPage() {
  const [copiedLink, setCopiedLink] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const DATA_SOURCES = [
    {
      id: 'hosp_52k',
      name: 'Hospital Dataset',
      desc: '52K hospital directory with geo-tier classifications and network information.',
      url: null,
      refLabel: '52K hospitals',
      type: 'Primary Dataset',
      badge: '52K Hospitals'
    },
    {
      id: 'icici',
      name: 'ICICI Lombard Network',
      desc: 'Official cashless empanelled hospital network list published for ICICI Lombard.',
      url: 'https://healthstatic.policybazaar.com/health-insurance/Network_Lists/ICICI_Lombard.Updated.pdf',
      refLabel: 'ICICI_Lombard.Updated.pdf',
      type: 'Insurer Network',
      badge: 'Network List'
    },
    {
      id: 'aditya_birla',
      name: 'Aditya Birla Network',
      desc: 'Empanelled provider network list for Aditya Birla Health Insurance.',
      url: 'https://healthstatic.policybazaar.com/health-insurance/Network_Lists/health-insuranceNetwork_ListsAditya_Birla.pdf',
      refLabel: 'Aditya_Birla.pdf',
      type: 'Insurer Network',
      badge: 'Network List'
    },
    {
      id: 'hdfc',
      name: 'HDFC Network',
      desc: 'HDFC ERGO cashless hospital network list archived by Ditto Insurance.',
      url: 'https://joinditto.in/articles/content/files/2026/05/HDFC-Network-Hopital-List-ditto.pdf',
      refLabel: 'HDFC-Network-Hopital-List-ditto.pdf',
      type: 'Insurer Network',
      badge: 'Network List'
    },
    {
      id: 'niva_bupa',
      name: 'Niva Bupa Network',
      desc: 'Cashless hospital network list for Niva Bupa (formerly Max Bupa).',
      url: 'https://healthstatic.policybazaar.com/health-insurance/Network_Lists/Niva_Bupa_(formerly_known_as_Max_Bupa).pdf',
      refLabel: 'Niva_Bupa_(formerly_known_as_Max_Bupa).pdf',
      type: 'Insurer Network',
      badge: 'Network List'
    },
    {
      id: 'star_health',
      name: 'Star Health Network',
      desc: 'Empanelled hospital network list for Star Health Insurance.',
      url: 'https://healthstatic.policybazaar.com/health-insurance/Network_Lists/Star_Health1.pdf',
      refLabel: 'Star_Health1.pdf',
      type: 'Insurer Network',
      badge: 'Network List'
    },
    {
      id: 'pmjay',
      name: 'PMJAY Hospital Dataset',
      desc: 'Ayushman Bharat PMJAY synthetic hospital recommender dataset repository on GitHub.',
      url: 'https://github.com/AditiRoy171/pmjay_hospital_recommender/blob/main/synthetic_pmjay_dataset.csv',
      refLabel: 'synthetic_pmjay_dataset.csv',
      type: 'Government Dataset',
      badge: 'GitHub Dataset'
    },
    {
      id: 'cghs',
      name: 'CGHS Cost / Rates',
      desc: 'Central Government Health Scheme baseline procedure rate cards across cities.',
      url: 'https://cghshospitals.com/rates',
      refLabel: 'cghshospitals.com/rates',
      type: 'Government Benchmark',
      badge: 'CGHS Rates'
    },
    {
      id: 'apollo_cost',
      name: 'Room Cost Reference — Apollo Hospital Cost Breakdown',
      desc: 'Room rate categorization and ward breakdown reference guide.',
      url: 'https://fittour.in/guides/apollo-hospital-cost-breakdown',
      refLabel: 'apollo-hospital-cost-breakdown',
      type: 'Room Cost Benchmark',
      badge: 'Pricing Reference'
    }
  ];

  const COSTING_STEPS = [
    {
      step: 1,
      title: 'Procedure and city-tier benchmark foundation',
      body: 'Procedure costs are modeled across eight geographic tiers: Metro 1, Metro 2, Large City 1, Large City 2, City 1, City 2, Town 1 and Town 2. CGHS rates are used as a base benchmark, while procedure prices are researched/benchmarked across representative cities to create realistic low, mean and high ranges.'
    },
    {
      step: 2,
      title: 'Procedure-specific estimated stay',
      body: 'The engine fixes an estimated inpatient stay for each procedure from the benchmark data. For example, Metro 1 Knee Replacement uses a 4-day estimated stay. This stay is used when calculating accommodation charges.'
    },
    {
      step: 3,
      title: 'Tier-wise room-cost estimation',
      body: 'Room costs are estimated from approximate city-level prices and mapped to the same eight geographic tiers. They are categorized into General Ward, Twin Sharing and Single Private Room. The FitTour — Apollo Hospital Cost Breakdown is used as a supporting reference for understanding approximate hospital room pricing. These are benchmark estimates, not exact hospital quotations.'
    },
    {
      step: 4,
      title: 'Room charge calculation',
      body: "The selected tier-wise daily room rate is multiplied by the procedure's estimated stay. For Metro 1 Knee Replacement: approximately ₹2,500/day General, ₹5,750/day Twin Sharing and ₹12,000/day Private. For 4 days this gives ₹10,000, ₹23,000 and ₹48,000 respectively."
    },
    {
      step: 5,
      title: 'Final bill',
      body: 'Procedure charges + 20% doctor/specialist fees + 10% medicines/diagnostics + selected room rate × estimated stay = total estimated hospital bill.'
    },
    {
      step: 6,
      title: 'Insurance impact',
      body: 'Policy exclusions, room-rent caps, proportionate deductions, procedure sublimits, deductibles, co-pay, sum-insured excess and modeled non-medical expenses are then applied to estimate insurer and patient shares.'
    }
  ];

  const MOCK_DB_RECORDS = [
    {
      num: 1,
      title: 'Database Screenshot 1',
      collection: 'Policies Collection',
      id: '_id: "pol_demo_hdfc"',
      imgUrl: '/docs/page_4_img_1.jpeg',
      description: 'MongoDB mock database sample policy record (HDFC ERGO Corporate Group Health Shield).'
    },
    {
      num: 2,
      title: 'Database Screenshot 2',
      collection: 'Hospitals Collection',
      id: "ObjectId('6abc1d0bde1df00826528017a')",
      imgUrl: '/docs/page_5_img_1.png',
      description: 'MongoDB mock database sample hospital record (St. Joseph Hospital, Hoshiarpur).'
    },
    {
      num: 3,
      title: 'Database Screenshot 3',
      collection: 'Procedure Costs Collection',
      id: "ObjectId('6abc1d7a96b678beb17bbc9a')",
      imgUrl: '/docs/page_6_img_1.jpeg',
      description: 'MongoDB mock database sample procedure cost record (Angiography in Metro 1).'
    }
  ];

  return (
    <div className="how-it-works-page">
      <div className="hiw-content-container">

        {/* SECTION 1: DATA SOURCES & CITATIONS */}
        <section id="sources" className="hiw-section">
          <div className="hiw-section-header">
            <div className="hiw-section-icon">
              <Database size={22} />
            </div>
            <div>
              <h2 className="hiw-section-heading">Hospital Dataset, Costing & AI Methodology</h2>
              <p className="hiw-section-desc">
                52K Hospital Dataset — Insurance Networks, PMJAY, Cost Estimation and Policy Analysis
              </p>
            </div>
          </div>

          <div className="hiw-sources-grid">
            {DATA_SOURCES.map((source) => (
              <div key={source.id} className="hiw-source-card">
                <div className="hiw-source-header">
                  <span className="hiw-source-badge">{source.badge}</span>
                  <span className="hiw-source-type">{source.type}</span>
                </div>
                <h3 className="hiw-source-name">{source.name}</h3>
                <p className="hiw-source-desc">{source.desc}</p>
                
                <div className="hiw-source-footer">
                  {source.url ? (
                    <div className="hiw-url-actions">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hiw-link-btn"
                        title="Open reference URL"
                      >
                        <span>{source.refLabel}</span>
                        <ExternalLink size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(source.url, source.id)}
                        className="hiw-copy-btn"
                        title="Copy link"
                      >
                        {copiedLink === source.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ) : (
                    <div className="hiw-local-badge">
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>52K hospitals</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: COST ESTIMATION ENGINE */}
        <section id="engine" className="hiw-section">
          <div className="hiw-section-header">
            <div className="hiw-section-icon">
              <Calculator size={22} />
            </div>
            <div>
              <h2 className="hiw-section-heading">Cost Estimation Engine — End-to-End Working</h2>
            </div>
          </div>

          <div className="hiw-steps-flow">
            {COSTING_STEPS.map((s) => (
              <div key={s.step} className="hiw-step-item">
                <div className="hiw-step-number">{s.step}</div>
                <div className="hiw-step-body">
                  <h3 className="hiw-step-title">{s.title}</h3>
                  <p className="hiw-step-text">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formula Card */}
          <div className="hiw-formula-card">
            <div className="hiw-formula-title">Final Bill Calculation</div>
            <div className="hiw-formula-equation">
              Procedure charges + 20% doctor/specialist fees + 10% medicines/diagnostics + selected room rate × estimated stay = total estimated hospital bill
            </div>
          </div>
        </section>

        {/* SECTION 3: WORKED EXAMPLE (METRO 1 KNEE REPLACEMENT) */}
        <section id="example" className="hiw-section">
          <div className="hiw-section-header">
            <div className="hiw-section-icon">
              <Stethoscope size={22} />
            </div>
            <div>
              <h2 className="hiw-section-heading">Example: Knee Replacement in Metro 1</h2>
              <p className="hiw-section-desc">
                Benchmark: low ₹50,000, mean ₹2,70,000, high ₹4,00,000, estimated stay 4 days, with room rates of ₹2,500/day general, ₹5,750/day twin sharing and ₹12,000/day private.
              </p>
            </div>
          </div>

          <div className="hiw-calc-showcase">
            <div className="hiw-table-wrapper">
              <table className="hiw-data-table hiw-calc-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Calculation</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Procedure</strong></td>
                    <td>Mean benchmark</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹2,70,000</td>
                  </tr>
                  <tr>
                    <td><strong>Doctor fees</strong></td>
                    <td>20% × procedure</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹54,000</td>
                  </tr>
                  <tr>
                    <td><strong>Medicines & diagnostics</strong></td>
                    <td>10% × procedure</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹27,000</td>
                  </tr>
                  <tr>
                    <td><strong>Twin-sharing room</strong></td>
                    <td>₹5,750 × 4 days</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹23,000</td>
                  </tr>
                  <tr className="hiw-total-row">
                    <td><strong>Total</strong></td>
                    <td>All components</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                      ₹3,74,000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hiw-example-footnote">
              <Info size={15} />
              <span>
                *The ₹2,70,000 procedure amount is used only for demonstrating bill construction; the live engine uses hospital segment position and deterministic variation.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 4: MONGODB DATABASE LOOK & SCREENSHOTS */}
        <section id="db" className="hiw-section">
          <div className="hiw-section-header">
            <div className="hiw-section-icon">
              <Server size={22} />
            </div>
            <div>
              <h2 className="hiw-section-heading">Final Mock Database Look</h2>
              <p className="hiw-section-desc">
                The following screenshots show the final MongoDB mock database structure and sample records used in the project.
              </p>
            </div>
          </div>

          {/* Database Link */}
          <div className="hiw-db-link-card">
            <div className="hiw-db-link-info">
              <Server size={20} color="var(--primary)" />
              <div>
                <strong>Database Link</strong>
                <div className="db-url-text">
                  https://cloud.mongodb.com/v2/6a9d3db249e0752ff873ec0f#/explorer/6a9d3dfbfafdddd2d2997237
                </div>
              </div>
            </div>
            <div className="hiw-db-actions">
              <a
                href="https://cloud.mongodb.com/v2/6a9d3db249e0752ff873ec0f#/explorer/6a9d3dfbfafdddd2d2997237"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-btn pill-btn-primary"
              >
                <span>Open Database Explorer</span>
                <ExternalLink size={14} style={{ marginLeft: '6px' }} />
              </a>
            </div>
          </div>

          {/* 3 Database Screenshots matching the PDF */}
          <div className="hiw-db-records-grid">
            {MOCK_DB_RECORDS.map((rec) => (
              <div key={rec.num} className="hiw-db-card">
                <div className="hiw-db-card-header">
                  <div>
                    <span className="hiw-db-collection-tag">{rec.collection}</span>
                    <h3 className="hiw-db-record-title">{rec.title}</h3>
                  </div>
                  <code className="hiw-db-id">{rec.id}</code>
                </div>

                <p className="hiw-db-desc">{rec.description}</p>

                <div className="hiw-db-img-wrap" onClick={() => setLightboxImg(rec.imgUrl)}>
                  <img
                    src={rec.imgUrl}
                    alt={rec.title}
                    className="hiw-db-img"
                    loading="lazy"
                  />
                  <div className="hiw-img-hover-overlay">
                    <Eye size={20} />
                    <span>Click to Enlarge Screenshot</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Lightbox Modal for Full Screenshot Previews */}
      {lightboxImg && (
        <div className="hiw-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="hiw-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hiw-lightbox-close"
              onClick={() => setLightboxImg(null)}
              aria-label="Close Preview"
            >
              ✕
            </button>
            <img src={lightboxImg} alt="Enlarged Database Screenshot" className="hiw-lightbox-image" />
          </div>
        </div>
      )}
    </div>
  );
}
