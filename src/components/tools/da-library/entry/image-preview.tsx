import Image, { ImageProps } from 'next/image';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

interface ImagePreviewProps extends ImageProps {
  alt: string;
  className?: string;
  previewClassName?: string;
}
export default function ImagePreview({ ...props }: ImagePreviewProps) {
  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={250}
        disableHoverableContent
      >
        <TooltipTrigger asChild>
          <Image
            {...props}
            className={cn('cursor-pointer', props.className)}
            alt={props.alt}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Image Full Preview</span>
            <Image
              {...props}
              className={cn('h-full max-h-[450px] w-full cursor-pointer object-fill', props.previewClassName)}
              alt={props.alt}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
