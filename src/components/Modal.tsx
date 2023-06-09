import {
  Close,
  Content,
  Description,
  Portal,
  Root,
  Title,
} from '@radix-ui/react-dialog'
import { forwardRef, type ComponentProps, type ElementRef } from 'react'

export const Modal = Root

export const ModalContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentProps<typeof Content>
>(({ children, ...props }, forwardedRef) => (
  <Portal>
    <div className='modal modal-open modal-bottom z-30 animate-fadeIn overflow-hidden md:modal-middle'>
      <Content
        className='modal-box z-20 !max-w-3xl animate-slideUp overflow-hidden'
        ref={forwardedRef}
        {...props}
      >
        {children}
      </Content>
    </div>
  </Portal>
))

ModalContent.displayName = 'ModalContent'

export const ModalClose = forwardRef<
  ElementRef<typeof Close>,
  ComponentProps<typeof Close>
>(({ children, ...props }, forwardedRef) => (
  <Close asChild {...props} ref={forwardedRef}>
    {children}
  </Close>
))

ModalClose.displayName = 'ModalClose'

export const ModalTitle = forwardRef<
  ElementRef<typeof Title>,
  ComponentProps<typeof Title>
>(({ ...props }, forwardedRef) => (
  <Title
    className='mb-4 text-center text-2xl font-medium'
    {...props}
    ref={forwardedRef}
  />
))

ModalTitle.displayName = 'ModalTitle'

export const ModalDescription = Description
