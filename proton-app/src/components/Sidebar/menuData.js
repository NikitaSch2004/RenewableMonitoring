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
      { icon: Smartphone, text: 'App', to: '/', rightElement: null },
      { icon: ShoppingBag, text: 'E-commerce', to: '/ecommerce', rightElement: null },
      { icon: ChartNoAxesCombined, text: 'Analytics', to: '/analytics', rightElement: null },
      { icon: Landmark, text: 'Banking', to: '/banking', rightElement: null },
      { icon: PlaneTakeoff, text: 'Booking', to: '/booking', rightElement: null },
      { icon: FileText, text: 'File', to: '/file', rightElement: null },
      { icon: MonitorPlay, text: 'Course', to: '/course', rightElement: null },
    ]
  },
  {
    category: 'MANAGEMENT',
    items: [
      { icon: SquareUserRound, text: 'User', to: '/user', rightElement: 'arrow' },
      { icon: Package, text: 'Product', to: '/product', rightElement: 'arrow' },
      { icon: ShoppingCart, text: 'Order', to: '/order', rightElement: 'arrow' },
      { icon: Receipt, text: 'Invoice', to: '/invoice', rightElement: 'arrow' },
      { icon: LetterText, text: 'Blog', to: '/blog', rightElement: 'arrow' },
      { icon: Briefcase, text: 'Job', to: '/job', rightElement: 'arrow' },
      { icon: LandPlot, text: 'Tour', to: '/tour', rightElement: 'arrow'},
      { icon: Mail, text: 'Mail', to: '/mail', rightElement: 'notification', count: 32 },
      { icon: MessagesSquare, text: 'Chat', to: '/chat', rightElement: null },
      { icon: Calendar, text: 'Calendar', to: '/calendar', rightElement: null },
      { icon: Presentation, text: 'Kanban', to: '/kanban', rightElement: null },
    ]
  }
];

export default menuData;
