import {
  Arrow,
  Content,
  Group,
  Item,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import {
  forwardRef,
  type ComponentProps,
  type ElementRef,
  type ReactNode,
} from 'react'

export const Dropdown = Root

export const DropdownTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  ComponentProps<typeof Trigger>
>(({ ...props }, forwardedRef) => (
  <Trigger asChild {...props} ref={forwardedRef} />
))

DropdownTrigger.displayName = 'DropdownTrigger'

export const DropdownContent = ({ children }: { children: ReactNode }) => (
  <Portal>
    <Content loop className='dropdown-container z-40'>
      <Group asChild>
        <ul className='menu'>{children}</ul>
      </Group>
      <Arrow className='m-[2px] fill-current text-base-content/40' />
    </Content>
  </Portal>
)

DropdownContent.displayName = 'DropdownContent'

// TODO: use cn also here
export const DropdownItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentProps<typeof Item>
>(({ children, ...props }, forwardedRef) => (
  <Item asChild {...props} ref={forwardedRef}>
    <li className='dropdown-item'>
      <span>{children}</span>
    </li>
  </Item>
))

DropdownItem.displayName = 'DropdownItem'
