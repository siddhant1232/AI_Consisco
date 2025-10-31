import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef as reactForwardRef } from "react";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadFormInput = reactForwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isLoading }, ref) => {
    return (
      <form ref={ref} className="flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          id="file"
          type="file"
          name="file"
          accept="application/pdf"
          required
          disabled={isLoading}
          className={cn(isLoading && "opacity-50 cursor-not-allowed")}
        />

        <Button disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              processing...
            </>
          ) : (
            "Upload your PDF"
          )}
        </Button>
      </form>
    );
  },
);
UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;
