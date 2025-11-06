import { useEffect, useRef, useState } from 'react';
import { useTour } from '../../context/TourContext';
import StepTooltip from './StepTooltip';

const TourOverlay = () => {
  const { isRunning, currentStep, steps, stopTour } = useTour();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    if (isRunning && steps.length > 0) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Reset positioning state when step changes
      setIsPositioned(false);
      setTargetRect(null);
      
      // Scroll to target element
      const currentStepData = steps[currentStep];
      if (currentStepData) {
        const updateRect = () => {
          const targetElement = document.querySelector(currentStepData.target);
          if (targetElement) {
            // First, scroll into view
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Wait for scroll and layout to complete before calculating position
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const rect = targetElement.getBoundingClientRect();
                // Only update if we have valid dimensions
                if (rect.width > 0 && rect.height > 0) {
                  setTargetRect(rect);
                  setIsPositioned(true);
                }
              });
            });
          }
        };
        
        // Initial positioning with a small delay to ensure DOM is ready
        const timeoutId = setTimeout(updateRect, 100);
        
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect, true);
        
        return () => {
          clearTimeout(timeoutId);
          window.removeEventListener('resize', updateRect);
          window.removeEventListener('scroll', updateRect, true);
        };
      }
    } else {
      document.body.style.overflow = '';
      setTargetRect(null);
      setIsPositioned(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isRunning, currentStep, steps]);

  if (!isRunning || steps.length === 0) {
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData || !targetRect || !isPositioned) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998]" />
    );
  }

  return (
    <>
      {/* Dark overlay with spotlight */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-60 z-[9998]"
        style={{
          clipPath: `polygon(
            0% 0%, 
            0% 100%, 
            ${targetRect.left}px 100%, 
            ${targetRect.left}px ${targetRect.top}px, 
            ${targetRect.right}px ${targetRect.top}px, 
            ${targetRect.right}px ${targetRect.bottom}px, 
            ${targetRect.left}px ${targetRect.bottom}px, 
            ${targetRect.left}px 100%, 
            100% 100%, 
            100% 0%
          )`
        }}
        onClick={(e) => {
          // Prevent closing on overlay click
          e.stopPropagation();
        }}
      />

      {/* Highlight border around target */}
      <div
        className="fixed z-[9997] border-4 border-blue-500 rounded-lg pointer-events-none"
        style={{
          left: `${targetRect.left - 4}px`,
          top: `${targetRect.top - 4}px`,
          width: `${targetRect.width + 8}px`,
          height: `${targetRect.height + 8}px`,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Tooltip */}
      <StepTooltip
        step={currentStepData}
        stepIndex={currentStep}
        totalSteps={steps.length}
        targetRect={targetRect}
        onNext={() => {
          if (currentStep < steps.length - 1) {
            // Will be handled by parent
          } else {
            stopTour();
          }
        }}
        onPrevious={() => {
          // Will be handled by parent
        }}
        onClose={stopTour}
      />
    </>
  );
};

export default TourOverlay;


