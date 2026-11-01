"use client";

import type { FC, ReactNode } from "react";
import { Component, type ErrorInfo, useMemo, useState } from "react";

import { cn } from "cn";

import { useNotification } from "@shared/runtime/notifications";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@shared/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Flex } from "@shared/ui/flex";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

interface TrelloErrorBoundaryState {
  error?: Error;
  errorInfo?: ErrorInfo;
  hasError: boolean;
}

interface TrelloErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
}

interface TrelloErrorBoundaryClassProps extends TrelloErrorBoundaryProps {
  onRequestDetails?: () => void;
}

interface ErrorDetailsDialogProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  onClose: () => void;
  open: boolean;
}

const monoBlockClass =
  "overflow-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap break-words";

const ErrorDetailsDialog: FC<ErrorDetailsDialogProps> = ({ open, onClose, error, errorInfo }) => {
  return (
    <Dialog onOpenChange={(next) => !next && onClose()} open={open}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Typography as="span" className="text-destructive" variant="subtitle1">
              Trello component error details
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Typography as="p" className="mb-1 font-medium" variant="body2">
              Error message
            </Typography>
            <Typography as="p" className={cn(monoBlockClass, "text-destructive")} variant="body2">
              {error?.message || "Unknown error"}
            </Typography>
          </div>

          {(error?.stack || errorInfo?.componentStack) && (
            <Accordion className="w-full" collapsible type="single">
              {error?.stack ? (
                <AccordionItem value="stack">
                  <AccordionTrigger>Stack trace</AccordionTrigger>
                  <AccordionContent>
                    <pre className={monoBlockClass}>{error.stack}</pre>
                  </AccordionContent>
                </AccordionItem>
              ) : null}
              {errorInfo?.componentStack ? (
                <AccordionItem value="component-stack">
                  <AccordionTrigger>Component stack</AccordionTrigger>
                  <AccordionContent>
                    <pre className={monoBlockClass}>{errorInfo.componentStack}</pre>
                  </AccordionContent>
                </AccordionItem>
              ) : null}
            </Accordion>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={onClose} type="button" variant="outline">
            Close
          </Button>
          <Button onClick={() => window.location.reload()} type="button">
            Refresh page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

class TrelloErrorBoundaryClass extends Component<
  TrelloErrorBoundaryClassProps,
  TrelloErrorBoundaryState
> {
  constructor(props: TrelloErrorBoundaryClassProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TrelloErrorBoundaryState {
    return { error, hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger("TrelloErrorBoundary").error("TrelloErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleTryAgain = () => {
    this.setState({ error: undefined, errorInfo: undefined, hasError: false });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;

      return (
        <Alert className="m-2.5 border-destructive/30 bg-destructive/5" variant="destructive">
          <AlertTitle>Trello component error</AlertTitle>
          <AlertDescription className="space-y-3">
            <Typography as="p" variant="body2">
              {error?.message ?? "Something went wrong in this Trello view."}
            </Typography>

            <details className="text-sm">
              <summary className="cursor-pointer font-medium">Quick details</summary>
              <div className="mt-2 space-y-2 font-mono text-xs">
                {error?.stack ? (
                  <details>
                    <summary className="cursor-pointer">Stack trace</summary>
                    <pre className={cn(monoBlockClass, "mt-1")}>{error.stack}</pre>
                  </details>
                ) : null}
                {errorInfo?.componentStack ? (
                  <details>
                    <summary className="cursor-pointer">Component stack</summary>
                    <pre className={cn(monoBlockClass, "mt-1")}>{errorInfo.componentStack}</pre>
                  </details>
                ) : null}
              </div>
            </details>

            <Flex className="flex-wrap gap-2 pt-1" gap="sm">
              <Button onClick={this.handleTryAgain} size="sm" type="button">
                Try again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                type="button"
                variant="secondary"
              >
                Refresh page
              </Button>
              {this.props.onRequestDetails ? (
                <Button
                  onClick={this.props.onRequestDetails}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Show full details
                </Button>
              ) : null}
            </Flex>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export const TrelloErrorBoundary: FC<TrelloErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
}) => {
  const { showError } = useNotification();
  const [errorState, setErrorState] = useState<{ error?: Error; errorInfo?: ErrorInfo } | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState(false);

  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    setErrorState({ error, errorInfo });
    showError(`Trello error: ${error.message}`);

    if (onError) {
      onError(error, errorInfo);
    }
  };

  const resolvedFallback = useMemo(() => {
    if (!fallback) {
      return undefined;
    }

    return (
      <div className="space-y-2 p-2">
        {fallback}
        <Button onClick={() => setShowDetails(true)} size="sm" type="button" variant="outline">
          Show full details
        </Button>
      </div>
    );
  }, [fallback]);

  return (
    <>
      <TrelloErrorBoundaryClass
        fallback={resolvedFallback}
        onError={handleError}
        onRequestDetails={() => setShowDetails(true)}
      >
        {children}
      </TrelloErrorBoundaryClass>

      <ErrorDetailsDialog
        error={errorState?.error}
        errorInfo={errorState?.errorInfo}
        onClose={() => setShowDetails(false)}
        open={showDetails}
      />
    </>
  );
};
