import {
  Smartphone,
  ShoppingBag,
  ChartNoAxesCombined,
  Landmark,
  PlaneTakeoff,
  FileText,
  MonitorPlay,
  SquareUserRound,
  Package,
  ShoppingCart,
  Receipt,
  LetterText,
  Briefcase,
  LandPlot,
  Mail,
  MessagesSquare,
  Calendar,
  Presentation,
} from 'lucide-react';

const menuData = [
  {
    category: 'OVERVIEW',
    items: [
      { icon: Smartphone, text: 'App', to: '/', rightElement: null, disabled: false },
      { icon: ShoppingBag, text: 'E-commerce', to: '/ecommerce', rightElement: null, disabled: true },
      { icon: ChartNoAxesCombined, text: 'Analytics', to: '/analytics', rightElement: null, disabled: true },
      { icon: Landmark, text: 'Banking', to: '/banking', rightElement: null, disabled: true },
      { icon: PlaneTakeoff, text: 'Booking', to: '/booking', rightElement: null, disabled: true },
      { icon: FileText, text: 'File', to: '/file', rightElement: null, disabled: true },
      { icon: MonitorPlay, text: 'Course', to: '/course', rightElement: null, disabled: true },
    ]
  },
  {
    category: 'MANAGEMENT',
    items: [
      { icon: SquareUserRound, text: 'User', to: '/user', rightElement: 'arrow', disabled: false },
      { icon: Package, text: 'Product', to: '/product', rightElement: 'arrow', disabled: true },
      { icon: ShoppingCart, text: 'Order', to: '/order', rightElement: 'arrow', disabled: true },
      { icon: Receipt, text: 'Invoice', to: '/invoice', rightElement: 'arrow', disabled: true },
      { icon: LetterText, text: 'Blog', to: '/blog', rightElement: 'arrow', disabled: true },
      { icon: Briefcase, text: 'Job', to: '/job', rightElement: 'arrow', disabled: true },
      { icon: LandPlot, text: 'Tour', to: '/tour', rightElement: 'arrow', disabled: true},
      { icon: Mail, text: 'Mail', to: '/mail', rightElement: 'notification', count: 32, disabled: true },
      { icon: MessagesSquare, text: 'Chat', to: '/chat', rightElement: null, disabled: true },
      { icon: Calendar, text: 'Calendar', to: '/calendar', rightElement: null, disabled: true },
      { icon: Presentation, text: 'Kanban', to: '/kanban', rightElement: null, disabled: true },
    ]
  }
];

export default menuData;
