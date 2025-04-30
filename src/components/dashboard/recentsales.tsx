import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const salesData = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    avatar: "/avatars/01.png",
    fallback: "OM",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    avatar: "/avatars/02.png",
    fallback: "JL",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    avatar: "/avatars/03.png",
    fallback: "IN",
  },
  {
    id: 4,
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    avatar: "/avatars/04.png",
    fallback: "WK",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    avatar: "/avatars/05.png",
    fallback: "SD",
  },
  {
    id: 6,
    name: "Breh Davis",
    email: "breh.davis@email.com",
    amount: "+$39.00",
    avatar: "/avatars/05.png",
    fallback: "SD",
  },
  {
    id: 7,
    name: "NotBreh Davis",
    email: "notbreh.davis@email.com",
    amount: "+$39.00",
    avatar: "/avatars/05.png",
    fallback: "SD",
  },
  {
    id: 8,
    name: "Sofia Ansari",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    avatar: "/avatars/05.png",
    fallback: "SD",
  },
];

export function RecentSales() {
  return (
    <div className="space-y-8 w-full h-full overflow-y-scroll">
      {salesData.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="w-9 h-9">
            <AvatarImage src={sale.avatar} alt="Avatar" />
            <AvatarFallback>{sale.fallback}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 ml-4">
            <p className="font-medium text-sm leading-none">{sale.name}</p>
            <p className="text-muted-foreground text-sm">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
}
