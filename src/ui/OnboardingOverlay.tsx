import { useState } from 'react'
import { useUiStore } from '../state'

const STEPS = [
  {
    title: 'Drag a colored face',
    body: 'Click and drag any sticker face to turn that layer. Release past the threshold to commit the move.',
  },
  {
    title: 'Rotate your view',
    body: 'Drag empty space around the cube to orbit the camera. Scroll or pinch to zoom in and out.',
  },
  {
    title: 'Keyboard shortcuts',
    body: 'Press R, L, U, D, F, or B for face turns. Hold Shift for prime moves. Press ? anytime for the full shortcut list.',
  },
]

export function OnboardingOverlay() {
  const onboardingComplete = useUiStore((state) => state.onboardingComplete)
  const completeOnboarding = useUiStore((state) => state.completeOnboarding)
  const [step, setStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(true)

  if (onboardingComplete) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      completeOnboarding(dontShowAgain)
      return
    }
    setStep((s) => s + 1)
  }

  const handleSkip = () => {
    completeOnboarding(dontShowAgain)
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="onboarding-card glass-panel">
        <div className="onboarding-card__step">
          Step {step + 1} of {STEPS.length}
        </div>
        <h2 id="onboarding-title" className="onboarding-card__title">
          {current.title}
        </h2>
        <p className="onboarding-card__body">{current.body}</p>
        <div className="onboarding-card__actions">
          <label className="onboarding-card__skip">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
            />
            Don&apos;t show again
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn" onClick={handleSkip}>
              Skip
            </button>
            <button type="button" className="btn btn--primary" onClick={handleNext}>
              {isLast ? 'Get started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
