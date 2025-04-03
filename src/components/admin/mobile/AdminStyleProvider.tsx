
import React, { useEffect } from 'react';

const AdminStyleProvider = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide export/import buttons */
      .admin-dashboard button:has([data-export-users]),
      .admin-dashboard button:has([data-import-users]),
      .admin-dashboard button:has(span:contains("Export Users")),
      .admin-dashboard button:has(span:contains("Import Users")),
      .admin-dashboard .export-users-btn,
      .admin-dashboard .import-users-btn,
      .admin-dashboard button:contains("Export"),
      .admin-dashboard button:contains("Import") {
        display: none !important;
      }
      
      /* Fix horizontal overflow issues */
      .admin-dashboard {
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      
      /* Fix tables on mobile */
      .admin-table-container {
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .admin-horizontal-scroll {
        max-width: 100%;
        padding-left: 0;
        padding-right: 0;
      }
      
      /* Adjust responsive grid layouts */
      .admin-stats-grid {
        width: 100%;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 12px;
      }
      
      /* Fix overflowing content */
      .admin-card, .admin-panel {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Truncate long text */
      .truncate-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      /* Luxury styling */
      .luxury-card {
        background: linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(249,246,251,1) 100%);
        border: 1px solid rgba(237, 233, 254, 0.5);
        box-shadow: 0 10px 25px -5px rgba(215, 187, 247, 0.1), 0 8px 10px -6px rgba(166, 108, 212, 0.05);
        border-radius: 16px;
        transition: all 0.3s ease;
      }
      
      .luxury-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 30px -8px rgba(215, 187, 247, 0.2), 0 10px 15px -3px rgba(166, 108, 212, 0.1);
      }
      
      .luxury-gradient {
        background: linear-gradient(135deg, var(--love-200), var(--passion-200));
      }
      
      /* Smooth transitions for edit mode */
      .edit-transition {
        transition: all 0.3s ease-in-out;
      }
      
      /* Prevent layout shifts during editing */
      .admin-table-row {
        min-height: 64px;
      }
      
      /* Admin form styling */
      .admin-form input,
      .admin-form select,
      .admin-form textarea {
        height: 42px !important;
        padding: 0.75rem 1rem !important;
        font-size: 1rem !important;
        border-radius: 0.75rem !important;
        width: 100% !important;
        border-color: rgba(226, 213, 250, 0.5) !important;
        background-color: rgba(255, 255, 255, 0.8) !important;
        transition: all 0.2s ease !important;
      }
      
      .admin-form input:focus,
      .admin-form select:focus,
      .admin-form textarea:focus {
        border-color: rgba(226, 213, 250, 0.8) !important;
        box-shadow: 0 0 0 2px rgba(226, 213, 250, 0.25) !important;
        background-color: white !important;
      }
      
      .admin-form .form-group,
      .admin-form .form-field {
        margin-bottom: 1.25rem !important;
      }
      
      .admin-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--love-800);
      }
      
      /* Add user form styling */
      .add-user-form {
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 10px 25px -5px rgba(215, 187, 247, 0.1), 0 8px 10px -6px rgba(166, 108, 212, 0.05);
        border: 1px solid rgba(237, 233, 254, 0.5);
        margin-bottom: 2rem;
      }
      
      .add-user-form h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        font-weight: 600;
        background: linear-gradient(to right, var(--love-600), var(--passion-600));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      /* Form grid for better layout */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      @media (min-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      
      @media (min-width: 1024px) {
        .form-grid {
          grid-template-columns: 1fr 1fr 1fr;
        }
      }
      
      /* Table styling */
      .luxury-table {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(243, 232, 255, 0.6);
      }
      
      .luxury-table thead tr {
        background: linear-gradient(to right, var(--love-50), var(--passion-50));
      }
      
      .luxury-table th {
        font-weight: 600;
        color: var(--love-800);
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        padding: 12px 16px;
      }
      
      .luxury-table tr {
        border-bottom: 1px solid rgba(243, 232, 255, 0.4);
        transition: background-color 0.2s ease;
      }
      
      .luxury-table tr:hover {
        background-color: rgba(254, 242, 254, 0.5);
      }
      
      .luxury-table td {
        padding: 12px 16px;
      }
      
      /* Button enhancements */
      .btn-luxury {
        background: linear-gradient(to right, var(--love-500), var(--passion-500));
        border: none;
        color: white;
        font-weight: 500;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
      }
      
      .btn-luxury:hover {
        box-shadow: 0 6px 16px rgba(236, 72, 153, 0.25);
        transform: translateY(-1px);
      }
      
      /* Exit Admin Button */
      .exit-admin {
        position: fixed;
        bottom: 80px;
        right: 16px;
        z-index: 999;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ec4899, #8b5cf6);
        color: white;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .exit-admin:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

export default AdminStyleProvider;
