'use client';

import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  ElementRef,
  FC,
  SetStateAction,
  useState,
} from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Check, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

// interface ComboBoxInputProps
//   extends ComponentPropsWithoutRef<typeof PopoverTrigger> {
//   label?: string;
//   error: string;
//   popoverOpen: boolean;
//   setPopoverOpen: Dispatch<SetStateAction<boolean>>;
//   comboboxItemProps: ComponentPropsWithoutRef<typeof CommandItem>;
//   comboboxEmptyText: string;
// }

interface ComboboxItem {
  id: string;
  name: string;
  value: string;
}

interface ComboBoxInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  defautlValue?: ComboboxItem;
  comboboxOpen: boolean;
  setComboboxOpen: Dispatch<SetStateAction<boolean>>;
  comboboxItems: ComboboxItem[];
  comboboxTriggerProps?: Omit<
    ComponentPropsWithoutRef<typeof PopoverTrigger>,
    'disabled'
  >;
  //   comboboxItemProps: ComponentPropsWithoutRef<typeof CommandItem>;
  comboboxItemProps?: Omit<
    ComponentPropsWithoutRef<typeof CommandItem>,
    'onSelect'
  >;
  onItemSelect: (value: string) => void;
  comboboxEmptyText?: string;
  comboboxInputPlaceholder?: string;
  comboboxTriggerButton?: React.ReactNode;
}

type ComboBoxTriggerRef = ElementRef<typeof PopoverTrigger>;

const ComboBoxInput = React.forwardRef<ComboBoxTriggerRef, ComboBoxInputProps>(
  (
    {
      label,
      error,
      disabled,
      defautlValue = null,
      comboboxOpen,
      setComboboxOpen,
      comboboxItems,
      comboboxItemProps,
      comboboxEmptyText = 'No result',
      comboboxInputPlaceholder = 'Search',
      //   comboboxTriggerProps: { className: triggerClassnames, ...triggerProps },
      comboboxTriggerProps,
      onItemSelect,
      comboboxTriggerButton,
    },
    ref
  ) => {
    //   const [popoverOpen, setPopoverOpen] = useState(false);
    //  FOR MANAGING POPOVER TRIGGER DISPLAY AND STYLES
    const [comboboxValue, setComboboxValue] = useState<null | ComboboxItem>(
      defautlValue
    );

    console.log({ comboboxItems });

    return (
      <>
        <div className="w-full">
          <Label htmlFor={comboboxTriggerProps?.id}>{label}</Label>
          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
            <PopoverTrigger
              asChild
              role="combobox"
              aria-expanded={comboboxOpen}
              {...comboboxTriggerProps}
              className={cn(
                comboboxTriggerProps?.className,
                !comboboxValue && 'text-muted-foreground',
                error && 'border-destructive'
              )}
              //   {...comboboxTriggerProps}
              //   {...triggerProps}
              disabled={disabled}
              ref={ref}
            >
              {comboboxTriggerButton || (
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                >
                  {comboboxValue?.name || `Select ${label}`}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              )}
            </PopoverTrigger>

            <span className="text-xs text-destructive">{error}</span>

            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
              {/* uses .name instead if .value becaues 'value' attribute on CommandItem uses .name */}
              {/* <Command className="w-full" defaultValue={defautlValue?.name}> */}
              <Command className="w-full" defaultValue={defautlValue?.value}>
                {/* CommandList must wrap the entire components for the component to work properly. And the data-[disabled] in the CommandItem styling should be changed to data-[disabled='true']. */}
                <CommandList>
                  {/* <ScrollArea className="h-72"></ScrollArea> */}
                  <CommandInput placeholder={comboboxInputPlaceholder} />
                  <CommandEmpty>{comboboxEmptyText}</CommandEmpty>
                  <CommandGroup className="w-full">
                    {comboboxItems &&
                      comboboxItems
                        .sort((a, b) => {
                          if (a.name < b.name) {
                            return -1;
                          }
                          if (a.name > b.name) {
                            return 1;
                          }
                          return 0;
                        })
                        .map((comboboxItem) => {
                          //   const isCurrentItem = comboboxItems.find(
                          //     (item) => comboboxItem.value === item.value
                          //   );
                          //   <CommandItem key={comboboxItem.id} {...comboboxItemProps}>
                          return (
                            <CommandItem
                              // key={comboboxItem.id}
                              // value={comboboxItem.value}
                              // uses .name instead of .value because search functionality searches whatever is used
                              // this is corrected in onItemSelect where the value is set to .value (the actual value)
                              value={comboboxItem.name}
                              onSelect={(value) => {
                                setComboboxOpen(false);
                                setComboboxValue({
                                  id: comboboxItem.id,
                                  // value,
                                  value: comboboxItem.value,
                                  name: comboboxItem.name,
                                });
                                // onItemSelect(value);
                                onItemSelect(comboboxItem.value);
                              }}
                              {...comboboxItemProps}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  comboboxItem.value === comboboxValue?.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {comboboxItem.name}
                            </CommandItem>
                          );
                        })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </>
    );
  }
);

export default ComboBoxInput;
