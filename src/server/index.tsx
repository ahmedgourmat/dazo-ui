import type { JSX } from 'react'
import { StyleSheet } from 'react-native'

/**
 * Server rendering for the web.
 *
 * react-native-web writes its CSS while components render. In the browser it
 * goes straight into a <style> tag; on the server it only collects it, so a
 * server-rendered page arrives unstyled until JavaScript loads. These helpers
 * read the collected CSS so it can be sent with the HTML.
 *
 * Import from 'react-native' (which the web build aliases to react-native-web),
 * not from 'react-native-web', so this reads the same style sheet the
 * components write to.
 */

/** The CSS react-native-web has collected, and the id of the <style> tag it hydrates. */
export interface StyleSheetContent {
  /** The tag's id. react-native-web finds the tag by it in the browser and keeps using it. */
  id: string
  /** Every rule generated so far. */
  textContent: string
}

export interface StyleElementProps {
  /** Your Content-Security-Policy nonce, if the page has one. */
  nonce?: string
}

type WebStyleSheet = { getSheet?: () => StyleSheetContent }

/**
 * The CSS for everything rendered so far. Call it after rendering the page,
 * on the server.
 */
export const getStyleSheet = (): StyleSheetContent => {
  const { getSheet } = StyleSheet as unknown as WebStyleSheet
  if (!getSheet) {
    throw new Error(
      "dazo-ui/server: StyleSheet.getSheet() isn't available. It comes from react-native-web, so alias 'react-native' to 'react-native-web' in your web build.",
    )
  }
  return getSheet()
}

/**
 * A <style> tag with the CSS for everything rendered so far. Render the page
 * first, then put this in the document's <head>.
 *
 * @example
 * // Next.js Pages Router: pages/_document.tsx
 * static async getInitialProps(ctx: DocumentContext) {
 *   const initialProps = await Document.getInitialProps(ctx)
 *   return { ...initialProps, styles: <>{initialProps.styles}{getStyleElement()}</> }
 * }
 */
export const getStyleElement = ({ nonce }: StyleElementProps = {}): JSX.Element => {
  const { id, textContent } = getStyleSheet()
  return <style id={id} nonce={nonce} dangerouslySetInnerHTML={{ __html: textContent }} />
}
