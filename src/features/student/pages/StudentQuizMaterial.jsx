import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClipboard, FiTarget } from 'react-icons/fi';

const StudentQuizMaterial = () => {
  const navigate = useNavigate();

  const pageClassName =
    'min-h-[calc(100vh-60px)] w-full px-[clamp(1rem,4vw,2rem)] pb-16 text-text-primary';
  const headerClassName = 'mb-6 flex flex-col gap-4';
  const headerInnerClassName = 'flex flex-wrap items-center justify-between gap-6';
  const headerLeftClassName = 'flex items-center gap-4';
  const iconWrapClassName = 'flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-bg-secondary text-brand';
  const breadcrumbClassName = 'flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-text-tertiary';
  const breadcrumbStrongClassName = 'font-semibold text-text-secondary';
  const visibilityClassName =
    'rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-text-secondary';
  const headerDescClassName = 'mt-1 text-sm text-text-secondary';
  const metaRowClassName = 'flex flex-wrap gap-3';
  const metaPillClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary';
  const metaValueClassName = 'font-semibold text-text-primary';
  const sectionTitleClassName = 'text-lg font-semibold text-text-primary';
  const sectionDescClassName = 'text-sm text-text-secondary';
  const listClassName = 'overflow-hidden rounded-sm border border-border';
  const rowClassName =
    'flex flex-col gap-3 border-b border-border bg-bg-secondary px-4 py-3 text-sm transition hover:bg-bg-tertiary sm:flex-row sm:items-center sm:justify-between';
  const rowTitleClassName = 'text-sm font-semibold text-text-primary';
  const rowSubtitleClassName = 'text-sm text-text-secondary';
  const buttonClassName =
    'inline-flex items-center gap-2 rounded-xs border border-border bg-bg-secondary px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-bg-tertiary';
  const primaryButtonClassName =
    'inline-flex items-center gap-2 rounded-xs border border-brand bg-brand px-3 py-2 text-xs font-semibold text-ink-onBrand transition hover:bg-brand/90';

  return (
    <div className={pageClassName}>
      <header className={headerClassName}>
        <div className={headerInnerClassName}>
          <div className={headerLeftClassName}>
            <div className={iconWrapClassName}>
              <FiClipboard size={20} />
            </div>
            <div>
              <div className={breadcrumbClassName}>
                <span className={breadcrumbStrongClassName}>HSOCIETY</span>
                <span>/</span>
                <span className={breadcrumbStrongClassName}>student-quiz-material</span>
                <span className={visibilityClassName}>Private</span>
              </div>
              <p className={headerDescClassName}>
                Short quizzes keep you aligned with each module and highlight topics to review.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={primaryButtonClassName}
              onClick={() => navigate('/student-bootcamps/overview')}
            >
              <FiTarget size={16} />
              Go to Learning Path
            </button>
          </div>
        </div>
        <div className={metaRowClassName}>
          <span className={metaPillClassName}>
            <FiTarget size={13} className="text-text-tertiary" />
            <span>Access</span>
            <strong className={metaValueClassName}>OPEN</strong>
          </span>
          <span className={metaPillClassName}>
            <FiCheckCircle size={13} className="text-text-tertiary" />
            <span>Checks</span>
            <strong className={metaValueClassName}>2</strong>
          </span>
        </div>
      </header>

      <div className="grid gap-6">
        <main>
          <section className="flex flex-col gap-4">
            <h2 className={sectionTitleClassName}>
              <FiClipboard size={15} className="mr-2 inline-block text-brand" />
              Quiz Checkpoints
            </h2>
            <p className={sectionDescClassName}>Validate understanding before moving into live sessions.</p>
            <div className={listClassName}>
              <article className={rowClassName}>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className={rowTitleClassName}>Module Check-ins</span>
                  <span className={rowSubtitleClassName}>Quick quizzes mapped to the bootcamp modules.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={buttonClassName}
                    onClick={() => navigate('/student-bootcamps/overview')}
                  >
                    Start check-in
                  </button>
                </div>
              </article>
              <article className={rowClassName}>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className={rowTitleClassName}>Skill Validation</span>
                  <span className={rowSubtitleClassName}>Confidence checks after each workshop.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={buttonClassName}
                    onClick={() => navigate('/student-bootcamps/overview')}
                  >
                    Open validation
                  </button>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>

    </div>
  );
};

export default StudentQuizMaterial;
