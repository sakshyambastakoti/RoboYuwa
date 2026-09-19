// ============================================================
//  Formspree Integration — RoboYuwa
//  Endpoint: https://formspree.io/f/mqpaezbo
//  Handles: Contact forms, Newsletter subscriptions, Membership
// ============================================================

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqpaezbo';

/**
 * Posts form data to Formspree.
 * @param {Object} data - Key/value pairs to submit.
 * @returns {Promise<Response>}
 */
async function submitToFormspree(data) {
    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    //  HOME CONTACT FORM  (#homeContactForm)
    // ==========================================================================
    const homeContactForm = document.getElementById('homeContactForm');
    const homeContactStatus = document.getElementById('homeContactStatus');
    const homeContactSubmitBtn = document.getElementById('homeContactSubmitBtn');

    if (homeContactForm) {
        homeContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName  = document.getElementById('homeContactName');
            const email     = document.getElementById('homeContactEmail');
            const phone     = document.getElementById('homeContactPhone');
            const message   = document.getElementById('homeContactMessage');
            const terms     = document.getElementById('homeContactTerms');

            // Validation
            if (!fullName?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
                if (homeContactStatus) {
                    homeContactStatus.className = 'form-status-msg error';
                    homeContactStatus.textContent = 'Please complete all required fields before submitting.';
                }
                return;
            }
            if (terms && !terms.checked) {
                if (homeContactStatus) {
                    homeContactStatus.className = 'form-status-msg error';
                    homeContactStatus.textContent = 'Please agree to the terms of service to continue.';
                }
                return;
            }

            // Loading state
            const originalHtml = homeContactSubmitBtn.innerHTML;
            homeContactSubmitBtn.disabled = true;
            homeContactSubmitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                const response = await submitToFormspree({
                    _subject:  'RoboYuwa — New Contact Message',
                    form_type: 'Home Contact',
                    name:      fullName.value.trim(),
                    email:     email.value.trim(),
                    phone:     phone?.value.trim() || '',
                    message:   message.value.trim()
                });

                if (response.ok) {
                    homeContactForm.reset();
                    homeContactSubmitBtn.innerHTML = '<span>Sent!</span> <i class="fa-solid fa-check" style="color:#10B981;"></i>';
                    if (homeContactStatus) {
                        homeContactStatus.className = 'form-status-msg success';
                        homeContactStatus.textContent = 'Thank you! Your message has been received. Our team will reach out to you shortly.';
                    }
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                homeContactSubmitBtn.innerHTML = originalHtml;
                if (homeContactStatus) {
                    homeContactStatus.className = 'form-status-msg error';
                    homeContactStatus.textContent = 'Something went wrong. Please try again or email us directly.';
                }
            } finally {
                homeContactSubmitBtn.disabled = false;
                setTimeout(() => {
                    homeContactSubmitBtn.innerHTML = originalHtml;
                    if (homeContactStatus) {
                        homeContactStatus.className = 'form-status-msg';
                        homeContactStatus.textContent = '';
                    }
                }, 6000);
            }
        });
    }

    // ==========================================================================
    //  EXECUTIVE CONTACT FORM  (#executiveContactForm)
    // ==========================================================================
    const execContactForm = document.getElementById('executiveContactForm');
    const contactFormStatus = document.getElementById('contactFormStatus');
    const execSubmitBtn = document.getElementById('execSubmitBtn');

    if (execContactForm) {
        execContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const projectType      = document.getElementById('projectType');
            const firstName        = document.getElementById('firstName');
            const lastName         = document.getElementById('lastName');
            const emailAddr        = document.getElementById('emailAddr');
            const phoneNum         = document.getElementById('phoneNum');
            const provinceLocation = document.getElementById('provinceLocation');
            const hearAbout        = document.getElementById('hearAbout');
            const messageText      = document.getElementById('messageText');

            // Validation
            if (!projectType?.value || !firstName?.value || !lastName?.value || !emailAddr?.value || !messageText?.value) {
                if (contactFormStatus) {
                    contactFormStatus.className = 'form-status-msg error';
                    contactFormStatus.textContent = 'Please fill in all required fields before submitting.';
                }
                return;
            }

            // Loading state
            const origBtnHtml = execSubmitBtn.innerHTML;
            execSubmitBtn.disabled = true;
            execSubmitBtn.innerHTML = '<span>TRANSMITTING...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                const response = await submitToFormspree({
                    _subject:      'RoboYuwa — Executive Contact Inquiry',
                    form_type:     'Executive Contact',
                    project_type:  projectType.value,
                    first_name:    firstName.value.trim(),
                    last_name:     lastName.value.trim(),
                    email:         emailAddr.value.trim(),
                    phone:         phoneNum?.value.trim() || '',
                    province:      provinceLocation?.value || '',
                    how_heard:     hearAbout?.value || '',
                    message:       messageText.value.trim()
                });

                if (response.ok) {
                    execContactForm.reset();
                    execSubmitBtn.innerHTML = '<span>SENT</span> <i class="fa-solid fa-check" style="color:#34D399;"></i>';
                    if (contactFormStatus) {
                        contactFormStatus.className = 'form-status-msg success';
                        contactFormStatus.textContent = 'Thank you! Your message has been routed to our leadership team. We will be in touch shortly.';
                    }
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                execSubmitBtn.innerHTML = origBtnHtml;
                if (contactFormStatus) {
                    contactFormStatus.className = 'form-status-msg error';
                    contactFormStatus.textContent = 'Submission failed. Please try again or contact us directly.';
                }
            } finally {
                execSubmitBtn.disabled = false;
                setTimeout(() => {
                    execSubmitBtn.innerHTML = origBtnHtml;
                    if (contactFormStatus) {
                        contactFormStatus.className = 'form-status-msg';
                        contactFormStatus.textContent = '';
                    }
                }, 6000);
            }
        });
    }

    // ==========================================================================
    //  FOOTER NEWSLETTER FORMS  (all pages)
    // ==========================================================================
    const newsletterForms = document.querySelectorAll('.footer-newsletter-box');

    newsletterForms.forEach((form) => {
        if (form.dataset.fsReady) return;
        form.dataset.fsReady = 'true';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const submitBtn  = form.querySelector('button[type="submit"]');

            if (!emailInput?.value.trim()) return;

            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            }

            try {
                const response = await submitToFormspree({
                    _subject:  'RoboYuwa — Newsletter Subscription',
                    form_type: 'Newsletter',
                    email:     emailInput.value.trim()
                });

                if (response.ok) {
                    emailInput.value = '';
                    if (submitBtn) {
                        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                        submitBtn.style.background = '#10b981';
                    }
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                    submitBtn.style.background = '#ef4444';
                }
            } finally {
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = originalBtnHtml;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }
                }, 3500);
            }
        });
    });

    // ==========================================================================
    //  MEMBERSHIP APPLICATION FORM  (#applySubmitBtn)
    // ==========================================================================
    const applySubmitBtn = document.getElementById('applySubmitBtn');

    if (applySubmitBtn) {
        // Override inline onclick handler
        applySubmitBtn.removeAttribute('onclick');

        applySubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const firstName   = document.getElementById('appFirstName');
            const lastName    = document.getElementById('appLastName');
            const email       = document.getElementById('appEmail');
            const phone       = document.getElementById('appPhone');
            const dob         = document.getElementById('appDOB');
            const gender      = document.getElementById('appGender');
            const institution = document.getElementById('appInstitution');
            const category    = document.getElementById('appCategory');
            const tier        = document.getElementById('appTier');
            const province    = document.getElementById('appProvince');
            const motivation  = document.getElementById('appMotivation');
            const refSource   = document.getElementById('appRef');

            // Collect checked interests
            const interestBoxes = document.querySelectorAll('.interest-check-tile input[type="checkbox"]');
            const interests = Array.from(interestBoxes)
                .filter(cb => cb.checked)
                .map(cb => cb.closest('label')?.querySelector('span')?.textContent?.trim())
                .filter(Boolean)
                .join(', ');

            // Validation
            if (!firstName?.value.trim() || !email?.value.trim() || !tier?.value) {
                alert('Please fill in all required (*) fields before submitting.');
                return;
            }

            // Loading state
            const originalBtnHtml = applySubmitBtn.innerHTML;
            applySubmitBtn.disabled = true;
            applySubmitBtn.innerHTML = '<i class="fa-light fa-spinner fa-spin"></i> Submitting Application...';

            try {
                const response = await submitToFormspree({
                    _subject:      'RoboYuwa — Membership Application',
                    form_type:     'Membership Application',
                    first_name:    firstName?.value.trim() || '',
                    last_name:     lastName?.value.trim() || '',
                    email:         email?.value.trim() || '',
                    phone:         phone?.value.trim() || '',
                    date_of_birth: dob?.value || '',
                    gender:        gender?.value || '',
                    institution:   institution?.value.trim() || '',
                    category:      category?.value || '',
                    tier:          tier?.value || '',
                    province:      province?.value || '',
                    interests:     interests || 'None selected',
                    motivation:    motivation?.value.trim() || '',
                    referral:      refSource?.value || ''
                });

                if (response.ok) {
                    applySubmitBtn.innerHTML = '<i class="fa-light fa-circle-check"></i> Application Submitted! We\'ll be in touch within 5 days.';
                    applySubmitBtn.style.background = 'linear-gradient(135deg,#376856,#274E40)';
                    // Reset all fields
                    [firstName, lastName, email, phone, dob, institution, motivation].forEach(el => { if (el) el.value = ''; });
                    [gender, category, tier, province, refSource].forEach(el => { if (el) el.selectedIndex = 0; });
                    interestBoxes.forEach(cb => { cb.checked = false; });
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                applySubmitBtn.innerHTML = '<i class="fa-light fa-triangle-exclamation"></i> Submission Failed. Please try again.';
                applySubmitBtn.style.background = 'linear-gradient(135deg,#7f1d1d,#991b1b)';
            } finally {
                applySubmitBtn.disabled = false;
                setTimeout(() => {
                    applySubmitBtn.innerHTML = originalBtnHtml;
                    applySubmitBtn.style.background = '';
                }, 6000);
            }
        });
    }

});
