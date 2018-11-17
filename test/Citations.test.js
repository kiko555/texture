import { test } from 'substance-test'
import { createTestVfs, openManuscriptEditor } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const citationTypes = {
  'bibr': 'Reference',
  'fig': 'Figure',
  'table': 'Table',
  'fn': 'Footnote'
}

const DOUBLE_CITATIONS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
    </article-meta>
  </front>
  <body>
    <p id="p-bibr">Lorem <xref id="xref-bibr" ref-type="bibr" rid="r1 r2">[1,2]</xref> ipsum.</p>
    <p id="p-fig">Lorem <xref id="xref-fig" ref-type="fig" rid="fig1 fig2">[Figure 1, Figure 2]</xref> ipsum.</p>
    <p id="p-table">Lorem <xref id="xref-table" ref-type="table" rid="t1 t2">[Table 1, Table 2]</xref> ipsum.</p>
    <p id="p-fn">Lorem <xref id="xref-fn" ref-type="fn" rid="fn1 fn2">[1,2]</xref> ipsum.</p>
    <table-wrap id="t1"><table><tbody><tr><td></td></tr></tbody></table></table-wrap>
    <table-wrap id="t2"><table><tbody><tr><td></td></tr></tbody></table></table-wrap>
    <fig id="fig1"><graphic /></fig>
    <fig id="fig2"><graphic /></fig>
  </body>
  <back>
    <fn-group>
      <fn id="fn1"><p></p></fn>
      <fn id="fn2"><p></p></fn>
    </fn-group>
    <ref-list>
      <ref id="r1"><element-citation publication-type="book"><publisher-loc>New York</publisher-loc><publisher-name>Test Press</publisher-name><pub-id pub-id-type="isbn">000</pub-id><person-group person-group-type="author"><name><surname>Test</surname></name></person-group></element-citation></ref>
      <ref id="r2"><element-citation publication-type="book"><publisher-loc>New York</publisher-loc><publisher-name>Test Press</publisher-name><pub-id pub-id-type="isbn">001</pub-id><person-group person-group-type="author"><name><surname>Test</surname></name></person-group></element-citation></ref>
    </ref-list>
  </back>
</article>
`

Object.keys(citationTypes).forEach(annoType => {
  test(`Citations: untoggle ${citationTypes[annoType]} citation (#959)`, t => {
    testCitationUntoggle(t, annoType)
  })
})

function testCitationUntoggle (t, citationType) {
  let { editor } = _setup(t, DOUBLE_CITATIONS)
  const selector = '[data-id="xref-' + citationType + '"]'

  // Toggle edit citation dialog
  const citationAnno = editor.find(selector)
  const citationLabelBefore = _getText(editor, selector)
  citationAnno.click()

  // Toggle first citation in list
  const firstCitation = editor.find('.sc-edit-xref-tool .se-option.sm-selected .sc-preview')
  firstCitation.click()
  const citationLabelAfter = _getText(editor, selector)

  t.notEqual(citationLabelBefore, citationLabelAfter, 'Label should change')
  t.notEqual(citationLabelAfter, '???', 'Label should not disappear')
  t.end()
}

function _getText (editor, selector) {
  return editor.find(selector).text()
}

function _setup (t, seedXML) {
  let testVfs = createTestVfs(seedXML)
  let {app} = setupTestApp(t, {
    vfs: testVfs,
    archiveId: 'test'
  })
  let editor = openManuscriptEditor(app)
  return { editor }
}