import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex gap-2 items-center px-4">
            {/* <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" /> */}
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        {/* <div className="flex flex-col flex-1 gap-4 p-4 pt-0"> */}
        {children}
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl aspect-video bg-muted" />
            <div className="rounded-xl aspect-video bg-muted" />
            <div className="rounded-xl aspect-video bg-muted" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted md:min-h-min" /> */}
        {/* </div> */}
      </SidebarInset>
    </SidebarProvider>
  );
}
