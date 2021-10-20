interface AXObjectSchema {
    name: string;
    attributes?: {
        name: string;
        value?: string;
    }[];
}
export declare function getInteractiveElementAXObjectSchemas(): AXObjectSchema[];
export {};
