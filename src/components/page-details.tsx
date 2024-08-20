import { cn } from '~/lib/utils';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
}
function PageTitle({ children, className, ...props }: PageTitleProps) {
  return (
    <h1
      {...props}
      className={cn('text-3xl font-semibold', className)}
    >
      {children}
    </h1>
  );
}

interface PageDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
}
function PageDescription({
  children,
  className,
  ...props
}: PageDescriptionProps) {
  return (
    <p
      {...props}
      className={cn('text-md line-clamp-1 text-muted-foreground', className)}
    >
      {children}
    </p>
  );
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  container?: boolean;
  className?: string;
}
function PageHeader({
  children,
  container,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        'border-b bg-primary-foreground/25 py-8',
        !container && 'px-8',
      )}
    >
      <div
        className={cn('space-y-2', container && 'container mx-auto', className)}
      >
        {children}
      </div>
    </div>
  );
}

interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  container?: boolean;
  className?: string;
}
function PageContent({
  children,
  container,
  className,
  ...props
}: PageContentProps) {
  return (
    <div
      {...props}
      className={cn(
        'py-8',
        container && 'container mx-auto',
        !container && 'px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

export { PageTitle, PageDescription, PageHeader, PageContent };
