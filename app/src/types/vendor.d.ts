declare module 'firebase/firestore' {
  export * from '@firebase/firestore'
}

declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react'

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = ComponentType<LucideProps>
  export const Accessibility: LucideIcon
  export const Activity: LucideIcon
  export const AlertCircle: LucideIcon
  export const AlertTriangle: LucideIcon
  export const Apple: LucideIcon
  export const ArrowDownLeft: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const ArrowRightLeft: LucideIcon
  export const ArrowUp: LucideIcon
  export const Ban: LucideIcon
  export const BarChart3: LucideIcon
  export const Bell: LucideIcon
  export const Briefcase: LucideIcon
  export const Building2: LucideIcon
  export const Calculator: LucideIcon
  export const Check: LucideIcon
  export const CheckCircle: LucideIcon
  export const CheckIcon: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronDownIcon: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronLeftIcon: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronRightIcon: LucideIcon
  export const ChevronUp: LucideIcon
  export const ChevronUpIcon: LucideIcon
  export const CircleCheckIcon: LucideIcon
  export const CircleIcon: LucideIcon
  export const ClipboardCheck: LucideIcon
  export const Clock: LucideIcon
  export const Compass: LucideIcon
  export const CreditCard: LucideIcon
  export const DollarSign: LucideIcon
  export const Euro: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const Facebook: LucideIcon
  export const FileText: LucideIcon
  export const Globe: LucideIcon
  export const GripVerticalIcon: LucideIcon
  export const Heart: LucideIcon
  export const HelpCircle: LucideIcon
  export const Home: LucideIcon
  export const InfoIcon: LucideIcon
  export const Instagram: LucideIcon
  export const Landmark: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const Loader2Icon: LucideIcon
  export const Lock: LucideIcon
  export const LogOut: LucideIcon
  export const Mail: LucideIcon
  export const MapPin: LucideIcon
  export const Menu: LucideIcon
  export const MessageCircle: LucideIcon
  export const MessageSquare: LucideIcon
  export const Mic: LucideIcon
  export const MinusIcon: LucideIcon
  export const Monitor: LucideIcon
  export const Moon: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const MoreHorizontalIcon: LucideIcon
  export const OctagonXIcon: LucideIcon
  export const PanelLeftIcon: LucideIcon
  export const Phone: LucideIcon
  export const PiggyBank: LucideIcon
  export const Play: LucideIcon
  export const PoundSterling: LucideIcon
  export const Receipt: LucideIcon
  export const Rocket: LucideIcon
  export const Save: LucideIcon
  export const Search: LucideIcon
  export const SearchIcon: LucideIcon
  export const Send: LucideIcon
  export const Settings: LucideIcon
  export const Shield: LucideIcon
  export const ShieldAlert: LucideIcon
  export const Smartphone: LucideIcon
  export const Sun: LucideIcon
  export const TrendingUp: LucideIcon
  export const TriangleAlertIcon: LucideIcon
  export const Twitter: LucideIcon
  export const User: LucideIcon
  export const UserCheck: LucideIcon
  export const UserX: LucideIcon
  export const Users: LucideIcon
  export const Wallet: LucideIcon
  export const X: LucideIcon
  export const XIcon: LucideIcon
  export const Youtube: LucideIcon
}
