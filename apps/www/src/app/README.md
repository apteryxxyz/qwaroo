Along with Next.js's regular app directory files, this directoy also has `content.tsx` files.
These files are simply just the content of server component pages that need access to client-side features such as state and context.

This means all pages must be server side, while pages that need client-side features must be split into two components, one server and one client.

```tsx
<Page> {/* <- This is server component */}
    <Content> {/* <- This is client component */}
        {...}        
    </Content>
</Page>
```