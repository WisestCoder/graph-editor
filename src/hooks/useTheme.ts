import useGlobal from '@/hooks/useGlobal'
import { Theme } from '@/types'

export default function useTheme() {
  const [global] = useGlobal()

  return global.theme as Theme
}
