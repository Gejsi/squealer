import { atom, useSetAtom } from 'jotai'

export const squealDialogAtom = atom<
  { username?: string; id: string; type: 'chat' | 'channel' } | undefined
>(undefined)

const useSquealDialog = () => {
  const setDialog = useSetAtom(squealDialogAtom)

  return {
    openSquealDialog: setDialog,
    closeSquealDialog: () => setDialog(undefined),
  }
}

export default useSquealDialog
