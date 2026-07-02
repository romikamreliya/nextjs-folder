import { Drawer, useOverlayState } from "@heroui/react";
import { useEffect } from "react";

export default function AppDrawer({
    title = "Drawer Title",
    description = "Drawer Description",
    toggle = false,
    onClose,
    children,
    footer,
    widthClassName = "max-w-3xl",
    bodyClassName = "",
    backdropClassName = "backdrop-blur-none bg-black/30",
}) {
    // Use uncontrolled mode (defaultOpen) to avoid the double-close race condition in HeroUI v3.
    // When controlled (isOpen: toggle), clicking CloseTrigger fires onOpenChange(false) → onClose()
    // → parent sets toggle=false → re-render sends isOpen=false AGAIN while the close animation
    // is already running, causing "Transition was aborted because of invalid state".
    const drawerState = useOverlayState({
        defaultOpen: false,
        onOpenChange: (isOpen) => {
            if (!isOpen) {
                onClose?.();
            }
        },
    });

    // Sync external toggle prop → internal state.
    // Only act when toggle and internal isOpen diverge to prevent loops.
    useEffect(() => {
        if (toggle && !drawerState.isOpen) {
            drawerState.open();
        } else if (!toggle && drawerState.isOpen) {
            drawerState.close();
        }
    }, [toggle, drawerState]);

    return (
        <Drawer state={drawerState} backdrop="transparent">
            <Drawer.Backdrop className={backdropClassName}>
                <Drawer.Content placement="right">
                <Drawer.Dialog className={`${widthClassName} w-full min-[770px]:rounded-l-3xl`}>
                    <Drawer.CloseTrigger />
                    <Drawer.Header>
                        <div className="pb-3">
                            <Drawer.Heading className="text-xl font-semibold text-(--color-text-primary)">{title}</Drawer.Heading>
                            <p className="mt-1 text-sm text-text-secondary">{description}</p>
                        </div>
                    </Drawer.Header>
                    <Drawer.Body className={bodyClassName}>
                        {children}
                    </Drawer.Body>
                    {footer && <Drawer.Footer className="border-t border-border-subtle pt-3">{footer}</Drawer.Footer>}
                </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
